import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

import api from '../../services/api';
import useForm from '../../hooks/useForm';

import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Success from '../../components/Success';
import Loading from '../../components/Loading';

import mapIcon from '../../utils/mapIcon';

import './styles.css';

interface Orphanage {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  whatsapp: string;
  instructions: string;
  open_from: number;
  open_until: number;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface OrphanageParams {
  id: string;
}

function EditOrphanage() {

  const history = useHistory();

  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [idOrphanage, setIdOrphanage] = useState<Number>();

  const params = useParams<OrphanageParams>();
  
  const initialFields = {
    orphanage: '',
    about: '',
    whatsapp: '',
    instructions: '',
    openFrom: '',
    openUntil: '',
  }

  const [
    form, errors,
    updateField, validateFields,
    hasOneFieldEmpty, updateForm
  ] = useForm(initialFields);

  const [openOnWeekends, setOpenOnWeekends] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [buttonSubmitDisabled, setButtonSubmitDisabled] = useState(true);

  const [errorImages, setErrorImages] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [position, setPosition] = useState({ latitude: -5.1069647, longitude: -38.3761372 });

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    api.get(`/orphanages/${params.id}`)
      .then(async (response) => {
        const orphanageData = response.data as Orphanage;
        
        const newOrphanage = {
          orphanage: orphanageData.name,
          about: orphanageData.about,
          whatsapp: orphanageData.whatsapp,
          instructions: orphanageData.instructions,
          openFrom: orphanageData.open_from,
          openUntil: orphanageData.open_until
        }

        const imagesOfOrphanage = orphanageData.images;
        const imagesUrl = imagesOfOrphanage.map((image) => image.url);
        const imagesFile: File[] = [];
        
        imagesOfOrphanage.forEach(async (image) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            const reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            
            const urlSplitted = image.url.split('/');
    
            const nameImage = urlSplitted.pop() || new Date().toString();

            const formatImage = nameImage.split('.').pop();
            const type = `image/${formatImage}`;

            const imageFile = new File([xhr.response], nameImage, {
              type
            });

            imagesFile.push(imageFile);
          };
          await xhr.open('GET', image.url);
          xhr.responseType = 'blob';
          await xhr.send();
        });

        updateForm(newOrphanage);
        setOrphanage(orphanageData);
        
        setImages(imagesFile);
        setPreviewImages(imagesUrl);

        setPosition({
          latitude: orphanageData.latitude,
          longitude: orphanageData.longitude,
        });
        
        setOpenOnWeekends(orphanageData.open_on_weekends);

        setIdOrphanage(Number(params.id));
      })
      .catch((err) => history.goBack());
  
  // eslint-disable-next-line
  }, [params.id, history]);

  useEffect(() => {
    if (hasOneFieldEmpty() || images.length === 0) {
      if (images.length > 0) {
        setErrorImages(false);
      }

      setButtonSubmitDisabled(true);
    }

    else {
      setErrorImages(false);
      setButtonSubmitDisabled(false);
    }
  }, [form, images, hasOneFieldEmpty, history]);

  function addNumber(e: ChangeEvent<HTMLInputElement>) {
    const regex = /^[0-9]+$/;
    
    if (regex.test(e.target.value) || e.target.value.trim() === '') {
      updateField(e);
    }
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function handleSelectImage(event: ChangeEvent<HTMLInputElement>) {
    const maxSize = 5 * 1024 * 1024;

    if (event.target.files) {
      const files = Array.from(event.target.files);

      const newFiles = [] as File[];

      files.forEach((file) => {
        if (file.size > maxSize) {
          const messageError = 'Imagem não pode ter mais de 5MB!';
          toast.error(messageError, {
            autoClose: 5000
          });
  
          return;
        }

        else {
          newFiles.push(file);
        }
      });

      const selectedImages = [...images, ...newFiles];
      setImages(selectedImages);

      const selectedImagesPreview = selectedImages.map((image) => {
        return URL.createObjectURL(image);
      });

      setPreviewImages(selectedImagesPreview);
    }
  }

  function handleRemoveImage(index: number) {
    const newImages: File[] = [];

    images.forEach((image, indexImage) => {
      if (index !== indexImage) {
        newImages.push(image);
      }
    });

    setImages(newImages);

    const newPreviewImages = newImages.map((image) => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(newPreviewImages);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    validateFields();

    if (hasOneFieldEmpty() || images.length === 0) {
      if (images.length === 0) {
        setErrorImages(true);
      }

      return;
    }

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', form.orphanage);
    data.append('about', form.about);
    data.append('whatsapp', form.whatsapp);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', form.instructions);
    data.append('open_from', form.openFrom);
    data.append('open_until', form.openUntil);
    data.append('open_on_weekends', String(openOnWeekends));

    console.log(images);
    
    images.forEach((image) => {
      data.append('images', image);
    });

    api.put(`/orphanages/${idOrphanage}`, data)
      .then(() => {
        setIsSuccess(true);
      })
      .catch(({ response }) => {
        const data = response.data;
        const messageError = data.messagesError[0];
        
        toast.error(messageError, {
          autoClose: 5000
        });
      });
  }

  if (!orphanage) {
    return <Loading />;
  }

  return (
    <>
      {!isSuccess ? (
        <div id="page-edit-orphanage">
          <ToastContainer />
          <Sidebar />

          <main>
            <h1>{`Editar ${orphanage.name}`}</h1>
            <form onSubmit={handleSubmit} className="edit-orphanage-form">
              <fieldset>
                <legend>Dados</legend>

                <Map 
                  className="map"
                  center={[position.latitude, position.longitude]} 
                  style={{ width: '100%' }}
                  zoom={15.50292}
                  onClick={handleMapClick}
                >
                  <TileLayer 
                    url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                  />

                  { position.latitude !== -1000 && (
                    <Marker 
                      interactive={false}
                      icon={mapIcon}
                      position={[position.latitude, position.longitude]} 
                    />
                  )}
                </Map>

                <Input 
                  name="orphanage"
                  label="Nome"
                  value={form.orphanage}
                  onChange={updateField}
                  labelError="Nome não informado"
                  error={errors.orphanage}
                />

                <Textarea 
                  name="about"
                  label="Sobre"
                  value={form.about}
                  onChange={updateField}
                  labelError="Informações sobre o orfanato não fornecidas"
                  error={errors.about}
                  comment="Máximo de 500 caracteres"
                />

                <Input
                  name="whatsapp"
                  label="Número do Whatsapp"
                  value={form.whatsapp}
                  onChange={addNumber}
                  labelError="Número do Whatsapp não informado"
                  error={errors.whatsapp}
                  placeholder="Ex: 5585992820129"
                />

                <div className="input-container">
                  <label 
                    className={errorImages ? 'error' : ''}
                    htmlFor="images"
                  >
                    { !errorImages ? 'Fotos' : 'Fotos não fornecidas'}
                  </label>
                  <div className="images-container">
                    { previewImages.map((image, index) => {
                      return (
                        <div key={image} className="image-container">
                          <button 
                            onClick={() => handleRemoveImage(index)}
                          >
                            <FiX size={24} color="#FF669D" />
                          </button>
                          <img src={image} alt="" />
                        </div>
                      )
                    })}

                    <label htmlFor="image" className="new-image">
                      <FiPlus size={24} color="#15B6D6" />
                    </label>
                  </div>

                  <input multiple onChange={handleSelectImage} type="file" id="image" />
                </div>
              </fieldset>

              <fieldset>
                <legend>Visitação</legend>
                
                <Textarea 
                  name="instructions"
                  label="Instruções"
                  value={form.instructions}
                  onChange={updateField}
                  labelError="Instruções sobre o orfanato não fornecidas"
                  error={errors.instructions}
                  comment="Máximo de 500 caracteres"
                />

                <div className="opening-hours-block">
                  <Input 
                    name="openFrom"
                    label="Horário de abertura"
                    value={form.openFrom}
                    onChange={updateField}
                    labelError="Horário não informado"
                    error={errors.openFrom}
                    type="time"
                  />

                  <Input 
                    name="openUntil"
                    label="Horário de fechamento"
                    value={form.openUntil}
                    onChange={updateField}
                    labelError="Horário não informado"
                    error={errors.openUntil}
                    type="time"
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="open_on_weekends">Atende fim de semana</label>

                  <div className="button-select">
                    <button
                      type="button"
                      className={openOnWeekends ? 'active' : ''}
                      onClick={() => setOpenOnWeekends(true)}
                    >
                      Sim
                    </button>
                    <button 
                      type="button"
                      className={!openOnWeekends ? 'active' : ''}
                      onClick={() => setOpenOnWeekends(false)}
                    >
                      Não
                    </button>
                  </div>
                </div>
              </fieldset>

              <button 
                className="confirm-button" 
                type="submit"
                disabled={buttonSubmitDisabled}
              >
                Confirmar
              </button>
            </form>
          </main>
        </div>
      ) : (
        <Success 
          title="Dados alterados!"
          description={`${form.orphanage} foi alterado(a), agora é só verificar os novos dados na lista de orfanatos cadastrados.`}
          textButton="Voltar aos orfanatos cadastrados"
        />
      )}
    </>
  );
}

export default EditOrphanage;
