import React, {useState, useEffect} from "react";

const API = process.env.REACT_APP_API_REACT_FLASK;

export const Users = () => {
    
    const [id, setId] = useState('') //evento captura dato text Id form
    const [name, setName] = useState('') //evento captura dato text Id form
    const [password, setPassword] = useState('') //evento captura dato text Id form

    const [editing, setEditing] = useState(false)
    const [idState, setIdState] = useState('')
    const [user, setUser] = useState([])

//-- crear usuarios
    const handleSubmit = async (e) => {//evento
        //{/* console.log('enviando....', id, name, password, API); */}
        e.preventDefault();
        //{/* Aquí puedes agregar los eventos ejecucion del form en console web */}

        if(!editing){
            try{
                const response = await fetch(`${API}/insert`, { //enviar datos a servidor
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({id, name, password})
                });
    
                const data = await response.json();
                
                if(!response.ok){
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                //console.log('enviandoooo...', id, name, password, API);
               
                console.log('Success:',data);         
            }catch(error){
                console.error('Error:',error);
            }
        }else{ //seccion para actualizar datos ya registrados
            try{
                const response = await fetch(`${API}/updateuser/${idState}`, { //enviar datos actualizar
                    method: 'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({id, name, password})
                });
    
                const data = await response.json();
                setEditing(false);
                setIdState('');

                if(!response.ok){
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                //console.log('enviandoooo...', id, name, password, API);
               
                console.log('Success:',data);         
            }catch(error){
                console.error('Error:',error);
            }
        }
        // Limpiar los campos del formulario usando referencias
        setId('');
        setName('');
        setPassword('');
        await findUsers();//invocar funcion mostrar datos 
    };
//-- find user
    const findUsers = async () => {
        const response = await fetch(`${API}/find`) //traer datos de local host
        const data = await response.json();  
        setUser(data)
        //console.log(data); 
    };
    useEffect(() => { //pintar en pantalla
        findUsers();
    }, []);
//-- delete user
    const deleteUser = async (_id) => {
        const userResponse = window.confirm('Are you sure you want to delete it?') 
        if(userResponse){
            try{
                const response = await fetch(`${API}/deleteuser/${_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();  
                if (response.ok) {
                    console.log('Success:', data);
                    await findUsers();//invocar funcion mostrar datos
                } else {
                    console.error('Error:', data);
                }
                }catch (error){
                    console.error('Error:', error);
                }
        }
    };

//-- edit user
    const editUser = async (_id) => {
        const response = await fetch(`${API}/getuser/${_id}`)
        const data = await response.json(); 
        console.log("Data:",data.id);

        setIdState(data._id)  //tambien setIdState(_id)
        setEditing(true)
        setId(data.id) //asignar datos obtenidos del json al formulario
        setName(data.name)   
        setPassword(data.password)    
    };

    return (
            <div className="row">
                <div className="col-md-4">
                    <form onSubmit={handleSubmit} className="card card-body"> {/* Ejecutar evento */}   
                        <label htmlFor="exampleFormControlInput1" className="form-label">Identification</label>    
                        <div className="form-group">
                            <input 
                                type="text" 
                                onChange={(e) => setId(e.target.value)} 
                                value={id}
                                className="form-control"
                                placeholder="Digit Id"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                            <input 
                                type="text" 
                                onChange={(e) => setName(e.target.value)} 
                                value={name}
                                className="form-control"
                                placeholder="Digit Name"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Password</label>    
                            <input 
                                type="password" 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password}
                                className="form-control"
                                placeholder="Digit Password"
                                autoFocus
                            />
                            <div id="passwordHelpBlock" className="form-text">
                                Your password must be 6-20 characters long,
                                contain letters and numbers,
                                and must not contain spaces.
                            </div>
                            <br/>
                        </div>
                        {/* <button type="submit">Submit</button>  */}   
                        <button className="btn btn-primary btn-block">
                            {editing ? 'Update' : 'Create'} 
                        </button> 
                        
                    </form>
                </div>
                <div className="col md-6">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Password</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map(user =>(
                                <tr key={user._id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        <button 
                                            className="btn btn btn-primary"
                                            onClick={() => editUser(user._id)}                                        
                                        >
                                        Edit
                                        </button> &ensp;
                                        <button 
                                            className="btn btn btn-success"
                                            onClick={() => deleteUser(user._id)}
                                            >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>
            </div>
    );
};
