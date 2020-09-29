import React, { useEffect, useState } from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createActor} from './graphql/mutations' 
import { listActors} from './graphql/queries'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);


const useStyles = makeStyles({
    table: {
      minWidth: 500,
    },
  });

const Home = () => {
    const [actors, setActors] = useState([])
    const [formState, setFormState] = useState({ firstName: '', lastName: '', age: 0, gender:'', movies: '' })


    useEffect(() => {
        fetchActors()

    }, [])

    const fetchActors = async () => {
        try {
            const actorData = await API.graphql(graphqlOperation(listActors))
            const actors = actorData.data.listActors.items
            setActors(actors)
        } catch (err) { console.log('Error when invoking graphqlOperation: listActors') }
    }

    const setInput = (key, value, isNumber = false) => {
        value = (isNumber) ? parseInt(value) : value;
        setFormState({ ...formState, [key]: value })
    }

    const addActor = async () => {
        try {
            if (!formState.firstName || !formState.lastName) return
            const actor = { ...formState }
            setActors([...actors, actor])
            setFormState({ firstName: '', lastName: '', age: 0, movies: '' })
            await API.graphql(graphqlOperation(createActor, { input: actor }))
        } catch (err) {
            console.log('Error when invoking graphqlOperation createActor:', err)
        }
    }

    const classes = useStyles();

    return (        
        <div className="home">
            <div className="home__table">
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell >FirstName</TableCell>
                                <TableCell >Last Name</TableCell>
                                <TableCell align="right">Age</TableCell>
                                <TableCell align="center">Movies</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actors.map((row) => (
                                <TableRow key={row?.name}>
                                    <TableCell component="th" scope="row">
                                        {row?.firstName}
                                    </TableCell>
                                    <TableCell >{row?.lastName}</TableCell>
                                    <TableCell align="right">{row?.age}</TableCell>
                                    <TableCell >{row?.movies}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="app__input">
                <input
                    onChange={event => setInput('firstName', event.target.value)}
                    value={formState.firstName}
                    placeholder="First Name"
                />
                <input
                    onChange={event => setInput('lastName', event.target.value)}
                    value={formState.lastName}
                    placeholder="Last Name"
                />
                <input
                    onChange={event => setInput('age', event.target.value, true)}
                    value={formState.age}
                    placeholder="Age"
                />
                <input
                    onChange={event => setInput('gender', event.target.value, true)}
                    value={formState.gender}
                    placeholder="Gender"
                />                
                <input
                    onChange={event => setInput('movies', event.target.value)}
                    value={formState.movies}
                    placeholder="Movies"
                />
                <button onClick={addActor}>Create Actor</button>
            </div>
        </div>
    );
}

export default Home;


