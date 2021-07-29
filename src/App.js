import firebase from './firebaseConnection';
import {useState} from 'react';
import './style.css';

function App() {
  const collection = 'usuarios';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState({});


  async function novoUsuario(){
    await firebase.auth().createUserWithEmailAndPassword(email,senha)
    .then( async (valor)=>{

      await firebase.firestore().collection(collection)
      .doc(valor.user.uid)
      .set({
        nome: nome,
        cargo: cargo,
        status: true
      }).then(()=>{
        setEmail('');
        setSenha('');
        setCargo('');
        setNome('');
      });
      console.log('usuario cadastrado');
    }).catch((e)=>{
      console.log(`Erro ao cadastro o novo usuario ${e}`);
    });
  }

  async function sairConta(){
    await firebase.auth().signOut();
    setUsuario({});
  }

  async function entra() {
    await firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(async (value)=>{

      await firebase.firestore().collection(collection)
      .doc(value.user.uid).get().then((rUsuario)=>{
        setUsuario({
          cd: value.user.uid,
          nome: rUsuario.data().nome,
          cargo: rUsuario.data().cargo,
          status: rUsuario.data().status,
          email: value.user.email
        })
      });

      setEmail('');
      setSenha('');
    }).catch((e)=>{
      console.log('ERRO AO LOGAR ' + e);
    });
  }

  return (
    <div>
      <h1>React + Firebase :)</h1><br/>

      <div className="container">
       
        < label>Nome : </label>
        <input type="text" value={nome} onChange={(e)=> setNome(e.target.value)} />

        < label>Cargo: </label>
        <input type="text" value={cargo} onChange={(e)=> setCargo(e.target.value)} />

        < label>E-mail: </label>
        <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} />

        < label>Senha: </label>
        <input type="password" value={senha} onChange={(e)=> setSenha(e.target.value)} />

        <button onClick={entra}>Entra</button>
        <button onClick={novoUsuario}>Cadastra novo usuario</button>
        <button onClick={sairConta}>Sair</button><br/>
      </div>

      <hr/><br/>
      
      {Object.keys(usuario).length > 0 && (
        <div>
          <strong>Código: </strong> {usuario.cd} <br/>
          <strong>Olá: </strong> {usuario.nome} <br/>
          <strong>Cargo: </strong> {usuario.cargo} <br/>
          <strong>E-mail: </strong> {usuario.email} <br/>
          <strong>Status: </strong> {usuario.status ? 'ATIVO' : 'DESATIVADO'} <br/>
        </div>
      )}

    </div>
  );
}

export default App;
