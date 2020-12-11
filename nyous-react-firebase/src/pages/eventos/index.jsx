import React, { useEffect, useState } from 'react';
import {Form, Button, Table, Card, Container} from 'react-bootstrap';
import { db, storage } from '../../utils/firebaseConfig';
import FileUploader from 'react-firebase-file-uploader';

const EventosPage = () => {

    const [ id, setId] = useState(0);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [eventos, setEventos] = useState([]);
    const [urlImagem, setUrlImagem] = useState('');

    useEffect(() => {
        listarEventos();
    }, []);

    const listarEventos = () => {
        try {
            db.collection('eventos')
                .get()
                .then( (result) => {
                    console.log(result.docs);
                    const data = result.docs.map(doc => {
                        return{
                            id : doc.id,
                            nome : doc.data().nome,
                            descricao : doc.data().descricao,
                            urlImagem : doc.data().urlImagem

                        }   
                    })
                    setEventos(data);
                })
                .catch(error => {
                    console.error(error);
                })
        } catch (error) {
            console.error(error)
        }
    }

    const salvar = (event) => {
        event.preventDefault();

        const evento = {
            nome : nome,
            descricao : descricao,
            urlImagem : urlImagem
        }

        if(id === 0 ){
            db.collection('eventos')
                .add(evento)
                .then(() => {
                    alert('Evento cadastrado!');
                })
                .catch(error => console.error(error));
        } else {
            db.collection('eventos')
                .doc(id)
                .set(evento)
                .then(() => {
                    alert('Evento editado!');
                })
        }
        listarEventos();
        limparCampos();
    }

    const limparCampos = () => {
        setId(0);
        setNome('');
        setDescricao('');
        setUrlImagem('');
    }

    const remover = (event) => {
        event.preventDefault();

        db.collection('eventos')
            .doc(event.target.value)
            .delete()
            .then(() => {
                alert('Evento removido!')
                listarEventos(); 
            })
    }

    const editar = (event) => {
        event.preventDefault();

        try {
            db.collection('eventos')
                .doc(event.target.value)
                .get()
                .then(doc => {
                    setId(doc.id);
                    setNome(doc.data().nome);
                    setDescricao(doc.data().descricao);
                    setUrlImagem(doc.data().urlImagem);
                });
        } catch (error) {
            console.error(error);
        }
    }

    const handleUploadError = error => {
        console.error(error);
    }

    const handleUploadSuccess = filename => {
        console.log('Sucesso upload: ' + filename);

        storage
            .ref('imagens')
            .child(filename)
            .getDownloadURL()
            .then(url => setUrlImagem(url))
            .catch(error => console.error(error))
    }


    return(
        <div>
            <Container>
                <h1>Eventos</h1>
                <p>Gerencie seus Eventos</p>
                <Card>
                    <Card.Body>
                        <Form onSubmit={event => salvar(event)}>
                            <Form.Group>
                                {urlImagem && <img src={urlImagem} style={{ width: '200px' }} /> }
                                <FileUploader
                                    accept="imagem/*"
                                    name="urlImagem"
                                    randomizeFilename
                                    storageRef={storage.ref('imagens')}
                                    onUploadError={handleUploadError}
                                    onUploadSuccess={handleUploadSuccess}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicNome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" value={nome} onChange={event => setNome(event.target.value)} placeholder="Nome do evento"></Form.Control>
                            </Form.Group>
                            
                            <Form.Group controlId="formBasicUrl">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control as="textarea" rows={3} value={descricao} onChange={event => setDescricao(event.target.value)} placeholder="Descrição do evento"/>
                            </Form.Group>
                            <Button type="submit">Salvar</Button>
                        </Form>
                    </Card.Body>
                </Card>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            
                            <th>Nome</th>
                            
                            <th>Descrição</th>
                            
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                            eventos.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td><img src={item.urlImagem} style={{ width: '150px' }}/></td>
                                        <td>{item.nome}</td>
                                        <td>{item.descricao}</td>
                                        <td>
                                            <Button variant="warning" value={item.id} onClick={event => editar(event)} >Editar</Button>
                                            <Button variant="danger" value={item.id} onClick={event => remover(event)} style={{ marginLeft : '40px'}}>Remover</Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    )

}

export default EventosPage;