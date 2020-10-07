// Calculate the face location based on the inputs from Clarifai
export const calculateFaceLocation = (data) => {
  // this bounding box is a % of the image
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  // Get the image element from FaceRecognition and width + height
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);

  // Return an object to fill the box state, which tells us the corner dots of the box
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - clarifaiFace.right_col * width,
    bottomRow: height - clarifaiFace.bottom_row * height,
  };
};
