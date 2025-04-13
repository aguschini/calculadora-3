const Boton = (props) => {

    function res(que) {
      switch (props.cartel) {
        case 'Suma' :
          props.setCont(props.cont +1)
        break
        case 'Resta' :
          props.setCont(props.cont -1)
        break
        case 'Producto' :
          props.setCont(props.cont *2)
        break
        case 'División' :
          props.setCont(props.cont / 2)
        break
      }
    }

    return (
        <button className="border-2 border-red-900 p-5"
        onClick = {() => res()}>
          {props.cartel}
        </button>
    )
}

export default Boton