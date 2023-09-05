import { createCanvas } from "canvas";

const post = {
    title: "Hello World",
    author: "Jimmy L.",
};

const width = 800;
const height = 800;
const titleY = 350;
const textX = 400;
const authorY = 450;

export default () => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#764abc";
    context.fillRect(0, 0, width, height);

    context.font = "bold 40pt 'PT Sans'";
    context.textAlign = "center";
    context.fillStyle = "#ffffff";

    context.fillText(post.title, textX, titleY);

    context.font = "40pt 'PT Sans'";
    context.fillText(`by ${post.author}`, textX, authorY);

    return canvas.toBuffer('image/jpeg');
};
