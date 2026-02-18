#Realizar búsqueda binaria en un array de objetos para encontrar la posición:(Debe estar ordenado)
arrayEjemplo = [
    {
        "momentoInicio": 1,
        "momentoFin": 2
    },
    {
        "momentoInicio": 3,
        "momentoFin": 4
    },
    {
        "momentoInicio": 5,
        "momentoFin": 6
    },
    {
        "momentoInicio": 7,
        "momentoFin": 8
    }
    ]


#Orden de guardado: 
def buscarIndiceGuardar(listaDeEventos, momentoInicio, momentoFin):
    longitudLista = len(listaDeEventos)
    print(longitudLista, 'longitudLista')
    if longitudLista == 0:
        return 0 #se puede almacenar al inicio porque no hay eventos
    medio = longitudLista//2
    

    def encontrarIndice(indiceInicial, indiceFinal):
        indiceMedio = (indiceInicial + indiceFinal)//2
        print(indiceMedio)
        valorMedioInicio = listaDeEventos[indiceMedio]["momentoInicio"]

        if indiceInicial == indiceFinal:
            return indiceInicial
        
        if valorMedioInicio == momentoInicio:
            #Comparar los valores laterales:
            valorMedioFinal = listaDeEventos[indiceMedio]["valorFinal"]
            if momentoFin == valorMedioFinal:
                return indiceMedio
            
            if momentoFin < valorMedioFinal:
                def encontrarMenor(elemento):
                    if indiceMedio!= 0:
                        inicioElementoAnterior = listaDeEventos[elemento-1]["momentoInicio"]
                        if inicioElementoAnterior == momentoInicio:
                            finElementoAnterior = listaDeEventos[elemento-1]["momentoInicio"]
                            if momentoFin == finElementoAnterior:
                                return elemento
                            elif momentoFin < finElementoAnterior:
                                return encontrarMenor(elemento-1)
                            return elemento + 1
                        return elemento
                
                encontrarMenor(indiceMedio)

            def encontrarMayor(elemento):
                if len(listaDeEventos-1) > indiceMedio:
                    inicioElementoPosterior =  listaDeEventos[elemento+1]["momentoInicio"]
                    if inicioElementoPosterior == momentoInicio:
                        finElementoAnterior = listaDeEventos[elemento+1]["momentoInicio"]
                        if momentoFin == finElementoAnterior: 
                            return elemento + 1
                        elif momentoFin < finElementoAnterior:
                            return elemento+1
                        return encontrarMayor(elemento+1)
                    return elemento + 1

            encontrarMayor(indiceMedio)
                
        elif valorMedioInicio > momentoInicio:
            return encontrarIndice(indiceInicial, indiceMedio - 1)
        
        return encontrarIndice(indiceMedio + 1, indiceFinal)
        
    encontrarIndice(0, longitudLista-1)

print(buscarIndiceGuardar(arrayEjemplo, 1, 3))

