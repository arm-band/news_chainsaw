const fs   = require('fs');
const path = require('path');
const settingsFile = './settings.json';

const isExistFile = (file) => {
    try {
        fs.statSync(file);
        return true;
    } catch(err) {
        if(err.code === 'ENOENT') {
            return false;
        }
    }
};
const fileRead_bootstrap = (filepath) => {
    return fs.readFileSync(filepath, 'utf8');
};
const jsonParse_kamiHaBarabaraNiNatta = (jsonStr) => {
    return JSON.parse(jsonStr);
};
const jsonAddIndex_Thirteen = (dataArray) => {
    for (let i = 0; i < dataArray.length; i++) {
        dataArray[i].index = i;
    }
    return dataArray;
};
const jsonSort_chainsaw = (jsonArray) => {
    return jsonArray.sort(function(a,b){
        if (a.index > b.index) {
            return -1;
        }
        if (a.index < b.index) {
            return 1;
        }
        return 0;
    });
};
const writeMd_weekFriday = (data, index, settings) => {
    const baseid = data.id.split('-')[0];
    const thumbnail = data.image ? data.image : 'eyecatch.jpg';
    const fmmd = `---
layout: article.ejs
title: ${data.description}
url: ${baseid}
date: ${data.date}T00:00:00+09:00
thumbnail: ${thumbnail}
excerpt: ${data.description}
category: ${data.category}
---

<p>${data.content}</p>`;

    const filename = `${index}.md`;
    const distFilePath = path.join(path.join('.', settings.distDir), filename);
    fs.writeFileSync(distFilePath, fmmd, (err) => {
        if(err) {
            console.log(err);
        }
    });
};

if(!isExistFile(settingsFile)) {
    console.log('設定ファイル settings.json が存在しません。');
    return false;
}

const settings = jsonParse_kamiHaBarabaraNiNatta(fileRead_bootstrap(settingsFile));

if(!isExistFile(settings.srcDir)) {
    console.log('ソースディレクトリ が存在しません。');
    return false;
}
if(!isExistFile(settings.distDir)) {
    console.log('ターゲットディレクトリ が存在しません。');
    return false;
}

const srcFilePath = path.join(path.join('.', settings.srcDir), settings.srcFile);

if(!isExistFile(srcFilePath)) {
    console.log('ソースファイル が存在しません。');
    return false;
}

const dataArray = jsonSort_chainsaw(jsonAddIndex_Thirteen(jsonParse_kamiHaBarabaraNiNatta(fileRead_bootstrap(srcFilePath))));

if(dataArray.length < 1) {
    console.log('新着情報のデータ が存在しません。');
    return false;
}

for (let i = 0; i < dataArray.length; i++) {
    writeMd_weekFriday(dataArray[i], i + 1, settings);
}
