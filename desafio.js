const fs = require('fs');
const path = require('path');
const fileToArray = async(path) => { //Leer el array de objetos dentro de un archivo
    try {
        return JSON.parse(await fs.promises.readFile(path))
    } catch (error) {
        console.log("error: en fileToArray", error);
    }
}

const arrayToFile = async(path, array) => {
    try {
        return JSON.stringify(await fs.promises.writeFile(path,JSON.stringify(array)))
    } catch (error) {
        console.log("error: en arrayToFile", error);
    }
}

const createNewFile = async(path) => {
    try {
        await fs.promises.writeFile(path,"[]")
    } catch (error) {
        console.log("error: en createNewFile", error);
    }
}

const fileCheck = async(path) => {
    const stats = fs.existsSync(path)
        if(stats === false){
            console.log(`Se creo el archivo ${path}`);
            await createNewFile(path)
        }
}


const validateFields = async ({title, description, price, thumbnail, stock, code}) =>{
    try {
        if((title == undefined || title == "") || (description == undefined || description == "") || (price == undefined || price == "") || (thumbnail== undefined || thumbnail== "") || (code == undefined) ){
            throw new Error("ERROR AL AGREGAR PRODUCTO: TODOS LOS CAMPOS SON OBLIGATORIOS")
        }else{
            return true;
        }
    } catch (error) {
        throw error
    }
}

const idExist = async (path,id) => {
    try {
        const array = await fileToArray(path)
        const result = array.find((obj) => obj.id === id)
        return result ? true : false
    } catch (error) {
        throw error
    }
}


class ProductManager{
    constructor(path){
        this.path = path
    }

    async addProduct(obj){
        try {
            await fileCheck(this.path)
            await validateFields(obj)
            let array = await fileToArray(this.path)
            let length = array.length
            let index = 0

                if(length === 0){
                    index = 1;
                }else{
                    index = array[length - 1].id + 1;
                }

                obj.id = index;
                array.push(obj)
                await arrayToFile(this.path,array)

            return obj.id
            
        } catch (error) {
            throw error;
        }
    }

    async getProduct(){
        try {
            await fileCheck(this.path);
            return fileToArray(this.path);
        } catch (error) {
            throw error
        }
    }

    async updateProduct(obj){
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            let index = array?.findIndex((x) => x.id === obj.id ); //Devuelve el objeto con ese id
                console.log(index);
                if(index === -1) throw new Error("No se encuentra el objeto");
                else {
                    array[index] = obj;
                    await arrayToFile(this.path,array)
                    return obj
                }
        } catch (error) {
            throw error
        }
    }

    async getProductById(id){
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            array = array.filter((x) => {
                return x.id === id;
            })

            if(array.length === 0) throw new Error("No se encontro el objeto");
            else return array;

        } catch (error) {
            throw error
        }
    }

    async deleteProduct(id){
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            let result = await idExist(this.path, id)
            array = array.filter((x) => { return x.id != id; })
            if(result === false) throw new Error("El id especificado no existe")
            else await arrayToFile(this.path,array) 
            return `Se elimino el archivo con el id : ${id}`
        } catch (error) {
            throw error
        }
    }
    
}


async function main(){
    try {
        let object = {
            title: "",
            description : "",
            price: 0.0,
            thumbnail: "",
            stock: 0,
            code: ""
        }

        let object2 = {
            title: "Prueba",
            description : "Descripcion prueba",
            price: 200,
            thumbnail: "N/A",
            stock: 15,
            code: "uuF3k9"
        }

        object.title = "producto 1";
        object.price = 20;
        object.thumbnail = "https://";
        object.code = "abc123";
        object.stock = 10;
        
        productos = new ProductManager('archivos.txt')
        
        /* console.log(await productos.addProduct(object2));  */

        /* console.log(await productos.getProduct()); */

        /* console.log(await productos.getProductById(8));
 */
        /* console.log(await productos.updateProduct(object2)); */

        /* console.log(await productos.deleteProduct(1)); */

        /* console.log(await productos.deleteProduct(14)); */
        

    } catch (error) {
        console.log("Error main :", error);
    }
}

main()

//Crear archivo, leer el archivo completo,leer el archivo y cargarlo en el array(carga).