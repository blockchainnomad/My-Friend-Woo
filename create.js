const dotenv = require("dotenv")
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const { background, body, face, ears, clothes, effect, hands, misc } = require("./traits.js");
const { saveMetadataUri } = require("./file.js");

const { NFTStorage, File } = require("nft.storage");

// NFT Storage API Key
require('dotenv').config()
const apiKey = process.env.APIKEY
const client = new NFTStorage({ token: apiKey })

const canvas = createCanvas(500, 500);
const ctx = canvas.getContext('2d');

const FILE_PATH = "./images";

//
const getAttributes = (v, k) => {

    let attributes = {};
    let trait_type = "";
    let value = "";

    switch (k) {
        case 0:
            trait_type = "Background";
            value = background[v - 1].name;
            break;
        case 1:
            trait_type = "Body";
            value = body[v - 1].name;
            break;
        case 2:
            trait_type = "Face";
            value = face[v - 1].name;
            break;
        case 3:
            trait_type = "Ears";
            value = ears[v - 1].name;
            break;
        case 4:
            trait_type = "Clothes";
            value = clothes[v - 1].name;
            break;
        case 5:
            trait_type = "Hands";
            value = hands[v - 1].name;
            break;
        case 6:
            trait_type = "Misc";
            value = misc[v - 1].name;
            break;
        case 7:
            trait_type = "Effect";
            value = effect[v - 1].name;
            break;
        default:
            trait_type = "";
            value = "";
    }

    attributes.trait_type = trait_type;
    attributes.value = value;

    return attributes;
}



// 생성된 배열을 하나씩 받아서 하나의 이미지를 생성한다.
// 이미지 파일명은 Woo001.png 형식으로 저장한다.
const saveImage = (canvas, index) => {
    const filename = `Woo${index.toString().padStart(3, 0)}`;
    fs.writeFileSync(`${FILE_PATH}/Result/${filename}.png`, canvas.toBuffer("image/png"));
    //console.log(filename);
};

// 토큰정보를 바탕으로 메타데이터를 생성하고 IPFS 에 업로드한다.
// t=토큰 조합(배열)
// i=인덱스
const uploadMetaData = async (t, i) => {

    let metadata = {
        description: "My Friends Woo",
        name: `Woo-${i}`,
        type: "Collectable",
        image: "https://",
        attributes: [],
    };

    // 토큰 조합은 배열이고 속성은 8개이므로 반복문으로 각 속성을 attributes 속성에 넣는다.
    for (let k = 0; k < 8; k++) {
        metadata.attributes.push(getAttributes(t[k], k));
    }

    const filename = `Woo${i.toString().padStart(3, 0)}`;
    metadata.image = new File([await fs.promises.readFile(`${FILE_PATH}/Result/${filename}.png`)], `${filename}.png`, {
        type: 'image/png',
    })

    const result = await client.store(metadata); // NFT Storage 서비스에 업로드한다.
    //console.log(`${i}=${result.url}`);
    saveMetadataUri(`${i}=${result.url}`); // 나중에 토큰 발행할 때 사용하기 위해 파일에 저장한다.
}

const create = async (t, i) => {

    const background = await loadImage(`${FILE_PATH}/Background/${t[0]}.png`);
    const body = await loadImage(`${FILE_PATH}/Body/${t[1]}.png`);
    const face = await loadImage(`${FILE_PATH}/Face/${t[2]}.png`);
    const ears = await loadImage(`${FILE_PATH}/Ears/${t[3]}.png`);
    const clothes = await loadImage(`${FILE_PATH}/Clothes/${t[4]}.png`);
    const hands = await loadImage(`${FILE_PATH}/Hands/${t[5]}.png`);
    const misc = await loadImage(`${FILE_PATH}/Misc/${t[6]}.png`);
    const effect = await loadImage(`${FILE_PATH}/Effect/${t[7]}.png`);

    // 아래서부터 위로 순서를 지켜야 한다.
    // 각 요소의 위치를 이미 맞추어 이미지를 만들었으므로 좌표는 (0,0)에 맞춘다.
    await ctx.drawImage(background, 0, 0, 500, 500);
    await ctx.drawImage(body, 0, 0, 500, 500);
    await ctx.drawImage(face, 0, 0, 500, 500);
    await ctx.drawImage(ears, 0, 0, 500, 500);
    await ctx.drawImage(clothes, 0, 0, 500, 500);
    await ctx.drawImage(hands, 0, 0, 500, 500);
    await ctx.drawImage(misc, 0, 0, 500, 500);
    await ctx.drawImage(effect, 0, 0, 500, 500);

    saveImage(canvas, i + 1); // 배열의 인덱스는 0부터 시작하고 토큰 번호는 1부터 시작

    await uploadMetaData(t, i + 1);

};

module.exports = {
    create
}


