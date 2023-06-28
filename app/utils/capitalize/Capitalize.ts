export const Capitalize = (word: string) => {
    try {
        if (word !== undefined) {
            if (word.indexOf(" ") !== -1) {
            // Dividir el string en un array de nombres
            let nombres = word.split(" ");
            // Iterar sobre cada nombre y convertir la primera letra en mayúscula
            const resNombre = nombres.map((nombre) => {
                return nombre.charAt(0).toUpperCase() + nombre.substring(1)
            })
            // Unir los nombres nuevamente en un solo string
            let resultado = resNombre.join(" ");
            
            return resultado
            } else {
                return word.charAt(0).toUpperCase() + word.substring(1)
            }
        }
        
    } catch (error) {
        if (word === undefined) {
            console.log("Capitalize detecto una variable 'undefined'")
        } else {
            console.log(error)
        }
    }
}