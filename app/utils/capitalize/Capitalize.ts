export const Capitalize = (word: string) => {
    // Dividir el string en un array de nombres
    let nombres = word.split(" ");
    // Iterar sobre cada nombre y convertir la primera letra en mayúscula
    const resNombre = nombres.map(nombre => {
        return nombre.charAt(0).toUpperCase() + nombre.substring(1)
    })
    // Unir los nombres nuevamente en un solo string
    let resultado = resNombre.join(" ");
    return resultado
}