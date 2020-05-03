import * as fs from 'fs';
import * as path from 'path';

class FileHandler {
    getFiles = (ext: string|string[], dir: string) => {
        if (!Array.isArray(ext))
            ext = [ext]

        let files = this.walk(dir)
        if (files.length === 0)
            return files;

        let filtered:string[] = [];
        for (let i = 0; i < ext.length; i++) {
            let f = files.filter(x => x.includes('.' + ext[i]))
            filtered = filtered.concat(f);
        }

        return filtered;
    }

    walk = (dir:string) => {
        var results:string[] = [];
        try {
            var list = fs.readdirSync(dir);
        } catch (e) {
            return [];
        }

        list.forEach((file) => {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results = results.concat(this.walk(file));
            } else {
                /* Is a file */
                results.push(file);
            }
        });
        return results;
    }

    replace = (file: string) => {
        fs.readFile(file, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            let result = data.match(/(?<=>)((?!{{).*)((?=<)(?!<\/v-icon))/g);
            result = result && result.filter(x => x.length > 0);

            let componentName = path.parse(file).base.replace('.vue','');
            let dict = {
                [componentName]: {}
            }
            if(result){
                for(let r of result){
                    let randomKey = 'trans_' + Math.random().toString(36).substr(2, 7);
                    let translationFunction =  '{{ $t(\'' + componentName + '.' + randomKey + '\') }}';
                    data = data.replace(r, translationFunction)
                    dict[componentName][randomKey] = r;
                }
            }

            fs.appendFile('nl.json', JSON.stringify(dict)+',', 'utf8', function (err) {
                if (err) return console.log(err);
            });
            fs.writeFile(file, data, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    }

}
export default FileHandler;