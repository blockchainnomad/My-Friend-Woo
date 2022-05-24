const { background, body, face, ears, clothes, effect, hands, misc } = require("./traits.js");
const { create } = require("./create.js");
//const { makeCSV } = require("./file.js");

const NUM_OF_BACKGROUND = 3;
const NUM_OF_BODY = 1;
const NUM_OF_FACES = 2;
const NUM_OF_EARS = 2;
const NUM_OF_CLOTHES = 3;
const NUM_OF_HANDS = 1;
const NUM_OF_MISC = 2;
const NUM_OF_EFFECT = 1;

// 10개 발행
const TARGET_NUM_OF_NFT = 10;

// 1번 특성을 2개 이하로 생성
const RARE_TRAIT = 1;
const MAX_NUM_OF_RARITY = 0;

let NFTs = [];
let totalCountOfRareTrait = 0;


// 난수 발생
const fnRng = (limit) => {
    return Math.floor(Math.random() * limit);
}


// 중복 검사후 생성
const fnGenerateWithoutRedundancy = () => {
    let nftTobe = [];

    // nftTobe.push(fnCheckRareTrait(face[fnRng(NUM_OF_FACES)].id));
    nftTobe.push(background[fnRng(NUM_OF_BACKGROUND)].id);
    nftTobe.push(body[fnRng(NUM_OF_BODY)].id);
    nftTobe.push(face[fnRng(NUM_OF_FACES)].id);
    nftTobe.push(ears[fnRng(NUM_OF_EARS)].id);
    nftTobe.push(clothes[fnRng(NUM_OF_CLOTHES)].id);
    nftTobe.push(hands[fnRng(NUM_OF_HANDS)].id);
    nftTobe.push(misc[fnRng(NUM_OF_MISC)].id);
    nftTobe.push(effect[fnRng(NUM_OF_EFFECT)].id);

    if (NFTs.length > 0) {
        for (let i = 0; i < NFTs.length; i++) {
            if (JSON.stringify(NFTs[i]) === JSON.stringify(nftTobe)) {
                return null;
            }
        }
    }
    return nftTobe;
}

// 특정 trait 를 가진 토큰이 일정수량을 넘지 못하도록 조절
const fnCheckRareTrait = (t) => {
    if (NFTs.length > 0 && t === RARE_TRAIT) {
        totalCountOfRareTrait++;
        if (totalCountOfRareTrait > MAX_NUM_OF_RARITY) {
            totalCountOfRareTrait--;
            return fnCheckRareTrait(face[fnRng(NUM_OF_FACES)].id);
        }
        return t;
    } else {
        return t;
    }
}

// nft 개수는 TARGET_NUM_OF_NFT 이하로 제한한다
while (NFTs.length < TARGET_NUM_OF_NFT) {
    const n = fnGenerateWithoutRedundancy();
    if (n !== null) {
        NFTs.push(n);
        //if (n[0] === 77) console.log(`RARITY=${NFTs.length}`);
    }
}

console.log(`NFT 생성 개수 = ${NFTs.length}`);
console.log(`희귀성 개수 = ${totalCountOfRareTrait}`);

(async () => {
    console.log("생성중입니다");
    //for (let i=0; i<NFTs.length; i++) {
    for (let i = 0; i < 10; i++) {
        await create(NFTs[i], i);
    }
})();