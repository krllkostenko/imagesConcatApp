'use strict';

function ImagesDetails(imageFile, source, imageId) {
    this.imageFile = imageFile;
    this.source = source;
    this.imageId = imageId;
    imageFile.src = source;
}

const drawImages = (images) => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i in images) {
        images[i].imageFile.onload = () => {
            const firstImageConfig = configureAspectRatio(images[0].imageId, canvas, images, 0);
            context.drawImage(images[0].imageFile, firstImageConfig.xStart, 0, firstImageConfig.renderableWidth, firstImageConfig.renderableHeight);

            if (images.length === 2) {
                const secondImageConfig = configureAspectRatio(images[1].imageId, canvas, images, 1);
                context.drawImage(images[1].imageFile, secondImageConfig.xStart, 0, secondImageConfig.renderableWidth, secondImageConfig.renderableHeight);
            }
        };
    }
};

const replaceArrayElements = (array, newElement, imageId) => {
    if (imageId === 'rightImage') {
        array = array.splice(0, 1);
    } else {
        array = array.splice(1, 1);
    }
    array.push(newElement);
    return array;
};

const configureAspectRatio = (imageId, canvas, images, i) => {
    const renderedImage = images[i].imageFile;
    let imageAspectRatio = renderedImage.width / renderedImage.height;
    let canvasAspectRatio = (canvas.width / 2) / canvas.height;
    let renderableHeight = canvas.height;
    let renderableWidth;
    let xStart = 0;

    if (imageAspectRatio < canvasAspectRatio) {
        renderableWidth = renderedImage.width * (renderableHeight / renderedImage.height);
    } else if (imageAspectRatio > canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = renderedImage.width * (renderableHeight / renderedImage.height);
        renderedImage.width = renderableWidth;
        renderedImage.height = renderableHeight;
    }
    if (images[i].imageId === 'rightImage') {
        xStart = renderableWidth;
    } else {
        xStart = 0;
    }

    return {
        xStart,
        renderableHeight,
        renderableWidth
    };
};

const images = [];
const getImageFiles = (images) => {
    const filesPicker = document.getElementsByClassName('image');
    for (let file of filesPicker) {
        file.addEventListener('change', (event) => {
            const imageId = file.getAttribute('id');
            const files = event.target.files;
            const fileReader = new FileReader();

            fileReader.onload = () => {
                const image = new Image();
                const imagesDetails = new ImagesDetails(image, fileReader.result, imageId);
                images.push(imagesDetails);
                if (images.length > 2) {
                    images = replaceArrayElements(images, imagesDetails, imageId);
                }
                drawImages(images);
            };
            fileReader.readAsDataURL(files[0]);
        });
    }
};

getImageFiles(images);