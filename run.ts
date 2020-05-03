const FileHandler = require('./FileHandler').default;

async function main() {
    const components = __dirname.replace('extract-trans','components');
    const fh = new FileHandler
    const vueFiles = fh.getFiles('vue', components)

    // console.log(vueFiles)
    for(let file of vueFiles){
        fh.replace(file)
    }

};
main();
