import React, { useEffect, useState, useId} from "react";
import {Grid} from "@mui/material";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import "../styles.css";
import { name, loremIpsum } from 'react-lorem-ipsum';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { useBuscarInfoQuery } from "../queries/dogquery";
import Collapse from '@mui/material/Collapse';




export default function App() {

    const [btnActivo, setBtnActivo] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [dogs, setDogs] = useState({perro: ''});
  

    const [aceptados, setAceptados] = useState([]);
    const [rechazados, setRechazados] = useState([]);


    const [openItemId, setOpen] = useState();
    const [id, setId] = useState(1);
    

    const handleExpandClick = (itemId) => {
        if(openItemId === itemId ){
            setOpen(0)
        }else{
            setOpen(itemId)
        }
       
        
    };

    /*const query = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })*/

    const cargarDog = () => {
        axios.get("http://127.0.0.1:8000/api/perros/random").then(
            (response) => {    
                
                setDogs({image:response.data.foto_url, dogname: response.data.nombre, descrip: response.data.descripcion, id: id, id_real: response.data.id});
                setBtnActivo(false);
                setCargando(false);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const cargarInteracciones = () => {
        axios.get("http://127.0.0.1:8000/api/interaccions/1").then(
            (interac) => {    
                //console.log(interac.data)
                interac.data.forEach(element => {
                    axios.get(`http://127.0.0.1:8000/api/perros/${element.perro_candidato_id}`).then(
                        (response) => {  
                            //console.log(response.data)
                            if(element.preferencia == "A"){
                                setAceptados((aceptados) => [...aceptados, {image:response.data.foto_url, name:response.data.nombre, descrip: response.data.descripcion, id: id, id_real: response.data.id}])
                            }  
                            if(element.preferencia == "R"){
                                setRechazados((rechazados) => [...rechazados, {image:response.data.foto_url, name:response.data.nombre, descrip: response.data.descripcion, id: id, id_real: response.data.id}])
                            } 
                        },
                        (error) => {
                            console.log(error);
                        }
                    );

                });

            },
            (error) => {
                console.log(error);
            }
        );
    };

    const insertarInteracion = (id_perro1, id_perro2, prefe) => {
        const data = {
            'perro_interesado_id': id_perro1,
            'perro_candidato_id': id_perro2,
            'preferencia': prefe
        }

        const headers = {
            'Content-Type': 'application/json',
        }

        console.log(data)
        
        axios.post("http://127.0.0.1:8000/api/interaccions", data, {
            headers: headers
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const cambiarInteracion = (id_perro1, id_perro2, prefe) => {
        const data = {
            'perro_interesado_id': id_perro1,
            'perro_candidato_id': id_perro2,
            'preferencia': prefe
        }

        const headers = {
            'Content-Type': 'application/json',
        }

        console.log(data)
        
        axios.post(`http://127.0.0.1:8000/api/cambiarInteraccion`, data, {
            headers: headers
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    

    useEffect(() => {
        setId(id+1);
        cargarDog();
        cargarInteracciones();
        console.log('i fire once');
    }, []);

    function agregarAceptado(){
        setAceptados((aceptados) => [...aceptados, {image:dogs.image, name:dogs.dogname, descrip: dogs.descrip, id: dogs.id, id_real: dogs.id_real }])
        insertarInteracion(1, dogs.id_real, "A")
        setBtnActivo(true);
        setCargando(true);
        cargarDog();
    }
    
    function agregarRechazado(){
        setRechazados((rechazados) => [...rechazados,  {image:dogs.image, name:dogs.dogname, descrip: dogs.descrip, id: dogs.id, id_real: dogs.id_real }])
        insertarInteracion(1, dogs.id_real, "R")
        setBtnActivo(true);
        setCargando(true);
        cargarDog();
    }

    const handleCambiarAAceptado = aux => { 
        setAceptados((aceptados) => [{image:aux.image, name:aux.name, descrip: aux.descrip, id: aux.id, id_real: aux.id_real  }, ...aceptados])
        cambiarInteracion(1, aux.id_real, "A")
        setRechazados(rechazados.filter(element => element.image !== aux.image));
    }

    const handleCambiarARechazado = aux => {
        setRechazados((rechazados) => [{image:aux.image, name:aux.name, descrip: aux.descrip, id: aux.id, id_real: aux.id_real  }, ...rechazados])
        cambiarInteracion(1, aux.id_real, "R")
        setAceptados(aceptados.filter(element => element.image !== aux.image));  
    }
   
    function nombreRandom(){
        let res = '';
        for(let i = 0; i < 4; i++){
            const random = Math.floor(Math.random() * 25);
            res += String.fromCharCode(97 + random);
        };
        return res;
    }

    function nombreRandom2(){
        let res = '';
        if (Math.random() >= 0.5){
            res = name('male')
        }else{
            res = name('female')
        }
        return res;
    }

    function generateDesc(){
        return loremIpsum({p: 1 , random:"true"})
    }

    return (
        <div className="app">
            <Grid container spacing={1} style={{ justifyContent: "center"}}> 
            
            <Grid item md={4} >
                    
                <Card sx={{ maxWidth: 500}}>
                    {cargando?<CircularProgress style={{padding: "7.37rem"}} disableShrink size="10rem" />:
                        <CardMedia
                            component="img"
                            flex= "1"
                            width= '100%'
                            height= '400'
                            src= {dogs.image}
                            alt={"alt"}
                            image={dogs.image}
                        />

                    }
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        {dogs.dogname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {dogs.descrip}
                        </Typography>
                    </CardContent>
                    <CardActions style={{justifyContent: 'space-evenly'}}>  
                        <Button size="small" disabled={btnActivo} onClick={agregarAceptado} title="Aceptar"><FavoriteIcon fontSize="large"></FavoriteIcon></Button>
                        <Button size="small" disabled={btnActivo} onClick={agregarRechazado} title="Rechazar"><CloseIcon fontSize="large"></CloseIcon></Button>
                        
                    </CardActions>
                    
                </Card>

          
                </Grid>
                <Grid item md={4} xs={6} style={{maxHeight: '95vh', overflow: 'auto'}}>
                    {aceptados.map((element, index) => (
                        <Card sx={{ maxWidth: 500}}>
                            <CardMedia
                                component="img"
                                flex= "1"
                                width= '100%'
                                height= '400'
                                src= {element.image}
                                alt={"alt"}
                                image={element.image}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                {element.name}
                                </Typography>
                                    <Collapse in={openItemId === element.id} timeout="auto" unmountOnExit>
                                        <Typography variant="body2" color="text.secondary">
                                        {element.descrip}
                                        </Typography>
                                    </Collapse>
                            </CardContent>
                            <CardActions style={{justifyContent: 'space-evenly'}}>  
                                <Button size="small" onClick={() =>handleCambiarARechazado(element)} title="Cambiar de lista"><ChangeCircleIcon fontSize="large"></ChangeCircleIcon></Button>
                                <Button size="small" onClick={() => handleExpandClick(element.id)} title="Ver descripción"><RemoveRedEyeIcon fontSize="large"></RemoveRedEyeIcon></Button>
                            </CardActions>
                        </Card>
                    ))}
                </Grid>
                
               
                <Grid item md={4} xs={6} style={{maxHeight: '95vh', overflow: 'auto'}}>
                            {rechazados.map((element) => (
                            <Card sx={{ maxWidth: 500}}>
                                <CardMedia
                                    component="img"
                                    flex= "1"
                                    width= '100%'
                                    height= '400'
                                    src= {element.image}
                                    alt={"alt"}
                                    image={element.image}
                                />

                                
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                    {element.name}
                                    </Typography>
                                    <Collapse in={openItemId === element.id} timeout="auto" unmountOnExit>
                                        <Typography variant="body2" color="text.secondary">
                                        {element.descrip}
                                        </Typography>
                                    </Collapse>
                                    
                                </CardContent>
                                <CardActions style={{justifyContent: 'space-evenly'}}>  
                                    <Button size="small" onClick={() =>handleCambiarAAceptado(element)} title="Cambiar de lista"><ChangeCircleIcon fontSize="large"></ChangeCircleIcon></Button>
                                    <Button size="small" onClick={() => handleExpandClick(element.id)} title="Ver descripción"><RemoveRedEyeIcon fontSize="large"></RemoveRedEyeIcon></Button>
                                </CardActions>
                            </Card>
                        ))}
                </Grid>

            </Grid>     
        </div>
    );
}