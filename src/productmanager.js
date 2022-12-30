import fs from 'fs'

const fileToArray = async (path) => { //Leer el array de objetos dentro de un archivo
    try {
        return JSON.parse(await fs.promises.readFile(path))
    } catch (error) {
        console.log("error: en fileToArray", error);
    }
}

const arrayToFile = async (path, array) => {
    try {
        return JSON.stringify(await fs.promises.writeFile(path, JSON.stringify(array)))
    } catch (error) {
        console.log("error: en arrayToFile", error);
    }
}

const createNewFile = async (path) => {
    try {
        await fs.promises.writeFile(path, "[]")
    } catch (error) {
        console.log("error: en createNewFile", error);
    }
}

const fileCheck = async (path) => {
    const stats = fs.existsSync(path)
    if (stats === false) {
        console.log(`Se creo el archivo ${path}`);
        await createNewFile(path)
    }
}


const validateFields = async ({ title, description, price, code, thumbnail }) => {
    try {
        if ((title == undefined || title == "") || (description == undefined || description == "") || (price == undefined || price == "") || (thumbnail == undefined || thumbnail == "") || (code == undefined)) {
            throw new Error("ERROR AL AGREGAR PRODUCTO: TODOS LOS CAMPOS SON OBLIGATORIOS")
        } else {
            return true;
        }
    } catch (error) {
        throw error
    }
}

const idExist = async (path, id) => {
    try {
        const array = await fileToArray(path)
        const result = array.findIndex(e => e.id == id)
        return result ? true : false
    } catch (error) {
        throw error
    }
}


class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getNextID(data) {
        const count = data.length
        if (count > 0) {
            const lastEvent = data[count - 1]
            const id = lastEvent.id + 1

            return id
        } else {

            return 1
        }
    }

    async addProduct(title, description, price, code, stock, category, status, thumbnail) {
        try {
            await fileCheck(this.path)
            /*             await validateFields(obj) */
            let array = await fileToArray(this.path)
            let length = array.length
            let index = 0

            if (length === 0) {
                index = 1;
            } else {
                index = array[length - 1].id + 1;
            }

            const producto = {
                id: index,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                status: status,
                category: category
            }

            array.push(producto)
            await arrayToFile(this.path, array)

            return producto

        } catch (error) {
            throw error;
        }
    }

    async getProducts() {
        try {
            await fileCheck(this.path);
            return fileToArray(this.path);
        } catch (error) {
            throw error
        }
    }

    async updateProductById(obj) {
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            let index = array?.findIndex((x) => x.id === obj.id); //Devuelve el objeto con ese id
            console.log(index);
            if (index === -1) throw new Error("No se encuentra el objeto");
            else {
                array[index] = obj;
                await arrayToFile(this.path, array)
                return obj
            }
        } catch (error) {
            throw error
        }
    }

    async getProductById(id) {
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            array = array.filter((x) => {
                return x.id === id;
            })

            if (array.length === 0) throw new Error("No se encontro el objeto");
            else return array;

        } catch (error) {
            throw error
        }
    }

    async deleteProduct(id) {
        try {
            await fileCheck(this.path);
            let array = await fileToArray(this.path);
            let result = await idExist(this.path, id)
            if (result === false) {
                throw new Error("El id especificado no existe")
            } else {
                const result = array.findIndex(e => e.id == id)
                array.splice(result, 1)
                console.log(array);
                await arrayToFile(this.path, array)
            }



            return `Se elimino el archivo con el id : ${id}`
        } catch (error) {
            throw error
        }
    }

}

/*  */
export default ProductManager;