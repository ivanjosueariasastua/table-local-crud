"use client"
import React from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';



export default function Home() {
  const today = new Date()

  const meses: { [key: string]: string } = {
    '01': 'enero',
    '02': 'febrero',
    '03': 'marzo',
    '04': 'abril',
    '05': 'mayo',
    '06': 'junio',
    '07': 'julio',
    '08': 'agosto',
    '09': 'septiembre',
    '10': 'octubre',
    '11': 'noviembre',
    '12': 'diciembre'
  }

  interface Persona {
    nombre: string,
    primerApellido: string,
    segundoApellido: string,
    fechaNacimiento: Date,
    genero: string
  }

  const getData = () => {
    const personas = localStorage.getItem('Personas')
    if (personas) {
      return JSON.parse(personas) as Persona[]
    }
    return [];
  }

  const [data, setData] = useState<Persona[]>(getData())
  const [nombre, setNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [genero, setGenero] = useState('')
  const [index, setIndex] = useState<number>(0)
  const [uso, setUso] = useState<Boolean>(true)

  const validateButton = () => {
    let message = ''
    if (!nombre) {
      message += 'No ingresó un nombre<br>'
    }
    if (!primerApellido) {
      message += 'No ingresó el primer apellido<br>'
    }
    if (!segundoApellido) {
      message += 'No ingresó el segundo apellido<br>'
    }
    if (!fechaNacimiento) {
      message += 'No seleccionó una fecha de nacimiento<br>'
    }
    if (!genero) {
      message += 'No seleccionó un género<br>'
    }
    if (message != '') {
      Swal.fire({
        title: uso ? 'Agregar Persona' : 'Modificar Persona',
        html: `<p>${message}</p>`,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
    }
    return message == ''
  }

  const savePerson = () => {
    if (validateButton()) {
      let personas = getData();
      let persona = {
        nombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento: new Date(fechaNacimiento),
        genero
      }
      if (uso) {
        personas.push(persona)

      } else {
        personas[index] = persona;
      }
      localStorage.setItem('Personas', JSON.stringify(personas));
      setData(getData())
      Swal.fire({
        title: uso ? 'Agregar Persona' : 'Modificar Persona',
        text: uso ? 'Persona agregada' : ' Persona modificada',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
      });
      clearFields()
    }
  }

  const convertirFecha = (fechaISO: string): string => {
    let fechaSinHora = fechaISO.split('T')[0]
    let fechaSeparada = fechaSinHora.split('-') as string[]
    let dia = fechaSeparada[2]
    let mes = meses[fechaSeparada[1]]
    let anho = fechaSeparada[0]
    const fechaFormateada = `${dia} de ${mes} del ${anho}`;
    return fechaFormateada;
  }

  const clearFields = () => {
    setNombre('')
    setPrimerApellido('')
    setSegundoApellido('')
    setFechaNacimiento('')
    setGenero('')
  }

  const editPersona = (item: Persona, index: number) => {
    setIndex(index)
    setNombre(item.nombre)
    setPrimerApellido(item.primerApellido)
    setSegundoApellido(item.segundoApellido)
    setFechaNacimiento(item.fechaNacimiento.toString().split('T')[0])
    setGenero(item.genero)
    setUso(false)
  }

  const removePersona = (index: number) => {
    let personas = getData();
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        personas.splice(index, 1);
        localStorage.setItem('Personas', JSON.stringify(personas));
        setData(getData())
        Swal.fire('Eliminado', 'El registro ha sido eliminado correctamente', 'success');
      }
    });
  }

  return (
    <div className='container'>
      <div className='my-3'>
        <h3 className='text-center'>Formulario de Datos</h3>
        <div className="row">
          <div className='col-md-6 col-sm-12 col-xs-12'>
            <label className="my-2" htmlFor='nombreInput'>Nombre:</label>
            <input className="form-control" id='nombreInput' type='text' placeholder='Nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <label className="my-2" htmlFor='primerApellidoInput'>Primer Apellido:</label>
            <input className="form-control" id='primerApellidoInput' type='text' placeholder='Primer Apellido' value={primerApellido} onChange={(e) => setPrimerApellido(e.target.value)} />
            <label className="my-2" htmlFor='segundoApellidoInput'>Segundo Apellido:</label>
            <input className="form-control" id='segundoApellidoInput' type='text' placeholder='Segundo Apellido' value={segundoApellido} onChange={(e) => setSegundoApellido(e.target.value)} />
          </div>
          <div className='col-md-6 col-sm-12 col-xs-12'>
            <label className="my-2" htmlFor='dateInput'>Fecha de Nacimiento:</label>
            <input className="form-control" id='dateInput' type='date' placeholder='Fecha de Nacimiento' value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
            <label className="my-2" htmlFor="genderSelect">Selecciona tu género:</label>
            <select className="form-control" id="genderSelect" value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Selecciona...</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
        <div className='d-flex justify-content-end my-2'>
          <button className='btn btn-primary' onClick={() => savePerson()}>{uso ? 'Agregar' : 'Modificar'}</button>
        </div>
      </div>
      <hr />
      <div>
        <table className='table table-striped'>
          <thead className='table-dark'>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Fecha de Nacimiento</th>
              <th>Género</th>
              <th style={{ maxWidth: 220, width: 220 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((item: Persona, index: number) => {
                return (
                  <tr>
                    <td>{(index + 1).toString()}</td>
                    <td>{item.nombre}</td>
                    <td>{item.primerApellido}</td>
                    <td>{item.segundoApellido}</td>
                    <td>{convertirFecha(item.fechaNacimiento.toString())}</td>
                    <td>{item.genero}</td>
                    <td>
                      <div className='d-flex justify-content-center align-items-center'>
                        <button className='btn btn-sm btn-warning rounded-5 mx-1' onClick={() => editPersona(item, index)}>
                          <i className="bi bi-pencil-square"> Editar</i>
                        </button>
                        <button className='btn btn-sm btn-danger rounded-5 mx-1' onClick={() => removePersona(index)}>
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

