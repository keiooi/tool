
const choose = (arr) => {
    const index = between(0, arr.length);
    return arr[index];
};

const between = (min, max) =>
    // max is not included
    min + Math.floor(Math.random() * (max - min));


class Namer {
    constructor() {
        this.loading = false;
        this.book = null;
    }

    // 
    formatStr(str) {
        // const res = str.replace(/[\s　 ]/g, '');
        let res = str.replace(/(\s|　|”|“){1,}|<br>|<p>|<\/p>/g, '');
        res = res.replace(/\(.+\)/g, '');
        return res;
    }

    splitSentence(content) {
        if (!content) {
            return [];
        }
        let str = this.formatStr(content);
        str = str.replace(/！|。|？|；/g, s => `${s}|`);
        str = str.replace(/\|$/g, '');
        let arr = str.split('|');
        arr = arr.filter(item => item.length >= 2);
        return arr;
    }

    // 清除标点符号
    cleanPunctuation(str) {
        const puncReg = /[<>《》！*\(\^\)\$%~!@#…&%￥—\+=、。，？；‘’“”：·`]/g;
        return str.replace(puncReg, '');
    }

    cleanBadChar(str) {
        const badChars = '胸鬼懒禽鸟鸡邪罪凶丑仇鼠蟋蟀淫秽狐鸡鸭蝇悔鱼肉苦犬吠窥血丧饥搔父母昏狗蟊疾病痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽毛婚匪婆羞辱'.split('');
        return str.split('').filter(char => badChars.indexOf(char) === -1).join('');
    }

    genName() {
        if (!this.book) {
            return null;
        }
        // const len = this.book.length;
        try {
            const passage = choose(this.book);
            const { content, title, author, book, dynasty } = passage;
            if (!content) {
                return null;
            }

            const sentenceArr = this.splitSentence(content);

            if (!(Array.isArray(sentenceArr) && sentenceArr.length > 0)) {
                return null;
            }

            // if (Array.isArray(sentenceArr) && sentenceArr.length <= 0) {
            //   log({ passage, sentenceArr });
            // }

            const sentence = choose(sentenceArr);


            const cleanSentence = this.cleanBadChar(this.cleanPunctuation(sentence));
            if (cleanSentence.length <= 2) {
                return null;
            }

            // log({ content, sentence });
            // const charList = this.cleanBadChar(cleanSentence);
            const name = this.getTwoChar(cleanSentence.split(''));
            const res = {
                name,
                sentence,
                content,
                title,
                author,
                book,
                dynasty,
            };

            return res;
        } catch (err) {
            console.log(err);

        }
        // log(res);
        // log('passage', passage);
    }

    getTwoChar(arr) {
        const len = arr.length;
        const first = between(0, len);
        let second = between(0, len);
        let cnt = 0;
        while (second === first) {
            second = between(0, len);
            cnt++;
            if (cnt > 100) {
                break;
            }
        }
        return first <= second ? `${arr[first]}${arr[second]}` : `${arr[second]}${arr[first]}`;
    }

    loadBook(book, cb) {
        const url = `../js/json/${book}.json`;
        this.loading = true;
        var seechcn = document.querySelector("#seeches");
        seechcn.innerHTML="waiting...";
        $.ajax({
            url,
            success: (data) => {
                // log(`${book} loaded`);
                this.loading = false;
                this.book = data;
                try{
                const sici = this.genName();
                seechcn.innerHTML = `<div class='name-box'>
                <div class='name-nm'>${cb}${sici.name}</div>
                <div class='name-summy'>${sici.sentence}</div>
                <div class='name-book'>「${sici.book}」&nbsp;•&nbsp;《${sici.title}》</div>
                <div class='name-author'>[${sici.dynasty}]&nbsp;•&nbsp;${sici.author || '佚名'}</div>
                </div>
                `;
                }catch(err){
                    seechcn.innerHTML="请重试!";
                }
                // if (typeof cb === 'function') {
                //     cb(data);
                // }
            },
            fail: err => err,
        });

    }
}
// export default Namer;
