import './App.css';
import { useState } from "react";

function App() {
  const [expresion, establecerExpresion] = useState('');
  const [historial, establecerHistorial] = useState([]);
  const [historialIndice, establecerHistorialIndice] = useState(-1);
  const [esResultado, establecerResultado] = useState(false);

  // Función para validar si un carácter es permitido
  const esCaracterPermitido = (char) => {
    return /^[0-9+\-*/().]$/.test(char);
  };

  // Función para validar si es un operador
  const esOperador = (char) => {
    return ['+', '-', '*', '/'].includes(char);
  };

  const calcular = () => {
    if (!expresion.trim()) return;
    
    try {
      const expresionFormateada = expresion.replace(/,/g, '.');
      const resultado = eval(expresionFormateada);
      
      if (!isFinite(resultado)) {
        throw new Error('Resultado no finito');
      }
      
      establecerHistorial([...historial, expresion]);
      establecerExpresion(resultado.toString());
      establecerHistorialIndice(-1);
      establecerResultado(true);
    } catch {
      establecerExpresion('Error');
      establecerResultado(true);
    }
  };

  const manejarParentesis = () => {
    establecerExpresion((previo) => {
      if (esResultado || previo === 'Error') {
        establecerResultado(false);
        return '(';
      }
  
      const abrir = (previo.match(/\(/g) || []).length;
      const cerrar = (previo.match(/\)/g) || []).length;
  
      const ultimo = previo.slice(-1);
  
      if (
        previo === '' ||
        esOperador(ultimo) ||
        ultimo === '('
      ) {
        return previo + '(';
      } else if (abrir > cerrar) {
        return previo + ')';
      } else {
        return previo + '*(';
      }
    });
  };

  // Función mejorada para manejar entrada desde botones
  const agregarExpresion = (valor) => {
    if (!esCaracterPermitido(valor)) return;
    
    establecerExpresion((previo) => {
      if (previo === 'Error' || previo === 'NaN' || previo === 'Infinity') {
        establecerResultado(false);
        return valor;
      }
  
      if (esResultado) {
        establecerResultado(false);
        return esOperador(valor) ? previo + valor : valor;
      }
      
      const ultimoCaracter = previo.slice(-1);
      
      // Evitar dos operadores consecutivos
      if (esOperador(valor) && esOperador(ultimoCaracter)) {
        return previo.slice(0, -1) + valor;
      }
      
      return previo + valor;
    });
  };

  // Función para manejar cambios en el input
  const manejarCambioInput = (e) => {
    const input = e.target.value;
    
    // Filtramos caracteres no permitidos
    let nuevoValor = input.split('').filter(esCaracterPermitido).join('');
    
    // Eliminamos operadores consecutivos
    nuevoValor = nuevoValor.replace(/([+\-*/])[+\-*/]+/g, '$1');
    
    // Reemplazamos comas por puntos para decimales
    nuevoValor = nuevoValor.replace(/,/g, '.');
    
    establecerExpresion(nuevoValor);
    establecerResultado(false);
  };

  const limpiarTodo = () => {
    establecerExpresion('');
    establecerHistorialIndice(-1);
    establecerResultado(false);
  };

  const limpiarUltimo = () => {
    establecerExpresion((previo) => previo.slice(0, -1));
  };

  const arribaHisorial = () => {
    if (historial.length === 0) return;
    const nuevoIndice = Math.min(historialIndice + 1, historial.length - 1);
    establecerHistorialIndice(nuevoIndice);
    establecerExpresion(historial[historial.length - 1 - nuevoIndice]);
  };

  const abajoHisorial = () => {
    if (historial.length === 0) return;
    const nuevoIndice = Math.max(historialIndice - 1, -1);
    establecerHistorialIndice(nuevoIndice);
    if (nuevoIndice === -1) establecerExpresion('');
    else establecerExpresion(historial[historial.length - 1 - nuevoIndice]);
  };

  return (
    <div className="bg-[#F5E4D7] text-black text-2xl h-screen w-screen overflow-hidden">
      <header className="bg-[#293241] text-white text-center text-4xl p-10 font-serif">
        <h1>Calculadora Versión 3</h1>
      </header>

      <div className="border-4 bg-[#293241] w-[500px] h-[680px] flex-col mx-auto mt-20 rounded-xl">
        <div className='mx-auto bg-[#E0FBFC] w-3/4 h-20 mt-10 flex items-center justify-between'>
          <div className='flex flex-col ml-2'>
            <div className='text-black cursor-pointer' onClick={arribaHisorial}>▲</div>
            <div className='text-black cursor-pointer' onClick={abajoHisorial}>▼</div>
          </div>
          
          <input 
            className='text-3xl text-right bg-transparent border-none focus:outline-none w-5/6 mr-4'
            type='text'
            value={expresion}
            onChange={manejarCambioInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                calcular();
              }
            }}
          />
        </div>

        {/* NUMEROS */}
          <div className='flex-row mt-8 mx-auto font-serif flex justify-between w-3/4'>
            <button onClick={limpiarTodo} className='w-[72px] h-[72px] bg-[#EE6C4D] text-white text-xl flex items-center justify-center rounded-full'>AC</button>
            <button onClick={limpiarUltimo} className='w-[72px] h-[72px] bg-[#EE6C4D] text-white text-xl flex items-center justify-center rounded-full'>C</button>
            <button onClick={() => manejarParentesis()} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>( )</button> {/* REVISAR */}
            <button onClick={() => agregarExpresion('/')} className='w-[72px] h-[72px] bg-[#3D5A80] text-white text-xl flex items-center justify-center rounded-full'>/</button>
          </div>

          <div className='flex-row mt-8 mx-auto font-serif flex justify-between w-3/4'>
            <button onClick={() => agregarExpresion('7')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>7</button>
            <button onClick={() => agregarExpresion('8')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>8</button>
            <button onClick={() => agregarExpresion('9')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>9</button>
            <button onClick={() => agregarExpresion('*')} className='w-[72px] h-[72px] bg-[#3D5A80] text-white text-xl flex items-center justify-center rounded-full'>x</button>
          </div>

          <div className='flex-row mt-8 mx-auto font-serif flex justify-between w-3/4'>
            <button onClick={() => agregarExpresion('4')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>4</button>
            <button onClick={() => agregarExpresion('5')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>5</button>
            <button onClick={() => agregarExpresion('6')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>6</button>
            <button onClick={() => agregarExpresion('-')} className='w-[72px] h-[72px] bg-[#3D5A80] text-white text-xl flex items-center justify-center rounded-full'>-</button>
          </div>

          <div className='flex-row mt-8 mx-auto font-serif flex justify-between w-3/4'>
            <button onClick={() => agregarExpresion('1')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>1</button>
            <button onClick={() => agregarExpresion('2')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>2</button>
            <button onClick={() => agregarExpresion('3')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>3</button>
            <button onClick={() => agregarExpresion('+')} className='w-[72px] h-[72px] bg-[#3D5A80] text-white text-xl flex items-center justify-center rounded-full'>+</button>
          </div>

          <div className='flex-row mt-8 mx-auto font-serif flex justify-between w-3/4'>
            <button onClick={() => agregarExpresion('0')} className='w-[180px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>0</button>
            <button onClick={() => agregarExpresion('.')} className='w-[72px] h-[72px] bg-[#98C1D9] text-white text-xl flex items-center justify-center rounded-full'>,</button>
            <button onClick={calcular} className='w-[72px] h-[72px] bg-[#3D5A80] text-white text-xl flex items-center justify-center rounded-full'>=</button>
          </div>

      </div>

    </div>
  );
}

export default App;
