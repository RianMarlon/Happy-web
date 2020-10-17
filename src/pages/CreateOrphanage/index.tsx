import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

import api from '../../services/api';
import useForm from '../../hooks/useForm';

import Sidebar from '../../components/Sidebar';

import mapIcon from '../../utils/mapIcon';

import './styles.css';

function CreateOrphanage() {

  const history = useHistory();

  const initialFields = {
    name: '',
    about: '',
    instructions: '',
    openingHours: '',
  }

  const [form, updateField] = useForm(initialFields)
  const [openOnWeekends, setOpenOnWeekends] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [position, setPosition] = useState({ latitude: -5.1069647, longitude: -38.3761372 });

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

      if (files[files.length - 1].size > maxSize) {
        const messageError = 'Imagem não pode ter mais de 5MB!'
        toast.error(messageError, {
          autoClose: 5000
        });

        return;
      }

      const selectedImages = [...images, ...files];
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

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', form.name);
    data.append('about', form.about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', form.instructions);
    data.append('opening_hours', form.openingHours);
    data.append('open_on_weekends', String(openOnWeekends));
    
    images.forEach((image) => {
      data.append('images', image);
    });

    api.post('/orphanages', data)
      .then(() => {
        alert('Cadastro realizado com sucesso!');
        history.push('/app');
      })
      .catch(({ response }) => {
        const data = response.data;
        const messageError = data.messagesError[0];
        
        toast.error(messageError, {
          autoClose: 5000
        });
      });
  }

  return (
    <div id="page-create-orphanage">
      <ToastContainer />
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-5.1069647, -38.3761372]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { position.latitude !== 0 && (
                <Marker 
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]} 
                />
              )}

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name"
                name="name"
                value={form.name}
                onChange={updateField} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="about"
                name="about"
                value={form.about}
                onChange={updateField} 
                maxLength={300}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>
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

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions"
                name="instructions"
                value={form.instructions}
                onChange={updateField}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
                id="opening_hours"
                name="openingHours"
                value={form.openingHours}
                onChange={updateField}
              />
            </div>

            <div className="input-block">
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

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateOrphanage;
