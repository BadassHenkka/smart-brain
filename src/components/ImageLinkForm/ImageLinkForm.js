import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {  // Destructure onInputChange and onPictureSubmit from the props.
    return (
        <div>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Give it a try.'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} />  {/* onChange is a react synthetic event that mimics what the html does whenever input changes. */}
                    <button 
                        className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                        onClick={onPictureSubmit}  /* On click do the onPictureSubmit */
                        >Detect
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;