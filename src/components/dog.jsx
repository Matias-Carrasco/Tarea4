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
        axios.get("https://dog.ceo/api/breeds/image/random").then(
            (response) => {      
                setId(id+1);
                setDogs({image:response.data.message, dogname: nombreRandom2(), descrip: generateDesc(), id: id });
                setBtnActivo(false);
                setCargando(false);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    

    useEffect(() => {
        cargarDog();
    }, []);

    function agregarAceptado(){
        setAceptados((aceptados) => [...aceptados, {image:dogs.image, name:dogs.dogname, descrip: dogs.descrip, id: dogs.id}])
        setBtnActivo(true);
        setCargando(true);
        cargarDog();
    }
    
    function agregarRechazado(){
        setRechazados((rechazados) => [...rechazados,  {image:dogs.image, name:dogs.dogname, descrip: dogs.descrip, id: dogs.id}])
        setBtnActivo(true);
        setCargando(true);
        cargarDog();
    }

    const handleCambiarAAceptado = aux => { 
        setAceptados((aceptados) => [{image:aux.image, name:aux.name, descrip: aux.descrip, id: aux.id }, ...aceptados])
        setRechazados(rechazados.filter(element => element.image !== aux.image));
    }

    const handleCambiarARechazado = aux => {
        setRechazados((rechazados) => [{image:aux.image, name:aux.name, descrip: aux.descrip, id: aux.id }, ...rechazados])
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