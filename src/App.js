import firebase from './firebaseConnection';
import {useState, useEffect} from 'react';
import './style.css';

function App() {
  const [idPost, setIdPost] = useState('0');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([]);
  const collection = 'posts';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [logado, setLogado] = useState(false);
  const [user, setUser] = useState({});

  useEffect(()=>{
    async function loadPosts() {
      await firebase.firestore().collection(collection)
      .onSnapshot((doc)=>{
        let meusPosts = [];

        doc.forEach((i)=>{
          meusPosts.push({
            id: i.id,
            titulo: i.data().titulo,
            autor: i.data().autor
          });
        });
        setPosts(meusPosts);
      });
    }

    loadPosts();
  },[]);

  useEffect(()=>{

    async function temGente(){
      await firebase.auth().onAuthStateChanged((u)=>{
        if(u){
          setLogado(true);
          setUser({
            uid: u.uid,
            email: u.email
          });
          //se tem usuario logado
        }else{
          //se não tem usuario logado
          setLogado(false);
          setUser({});
        }
      });
    }

    temGente();
  },[]);

  async function salvar(){
    await firebase.firestore().collection(collection)
    .add({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log('CADASTRO REALIZADO COM SUCESSO!');
      setTitulo('');
      setAutor('');
    }).catch((error)=>{
      console.log(`DEU ERRO : ${error}`);
    });
  }

  async function buscar() {
    await firebase.firestore().collection(collection)
    .get()
    .then((dados)=>{
      
      let lista = [];
      dados.forEach((doc)=>{
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })
      setPosts(lista);
    })
    .catch(()=>{
      console.log('DEU ERRO DA BUSCA!');
    })
  }

  async function editar() {
    if(idPost === '0'){
      alert('Post não selecionado!');
    }else{
      await firebase.firestore().collection(collection)
      .doc(idPost)
      .update({
        titulo: titulo,
        autor: autor
      }).then(()=>{
        console.log('Post atualizado');
        setIdPost('0');
        setTitulo('');
        setAutor('');
      }).catch((error)=>{
        console.log(`Erro no update ${error}`);
      });
    }    
  }

  async function excluir() {
    if(idPost === '0'){
      alert('Post não selecionado!');
    }else{
      await firebase.firestore().collection(collection).doc(idPost)
      .delete()
      .then(()=>{
        alert('Post excluido com sucesso!');
        setIdPost('0');
        setTitulo('');
        setAutor('');
      }).catch(()=>{
        alert('Post não selecionado!');
      })
    }
  }

  async function novoUsuario(){
    await firebase.auth().createUserWithEmailAndPassword(email,senha)
    .then(()=>{
      console.log('usuario cadastrado');
      setEmail('');
      setSenha('');
    }).catch((e)=>{
      console.log(`Erro ao cadastro o novo usuario ${e}`);
    })
  }

  async function sairConta(){
    await firebase.auth().signOut();
  }

  async function entra() {
    await firebase.auth().signInWithEmailAndPassword(email, senha)
    .then((value)=>{
      console.log(value.user);
      setEmail('');
      setSenha('');
    }).catch((e)=>{
      console.log('ERRO AO LOGAR ' + e);
    });
  }

  return (
    <div>
      <h1>React + Firebase :)</h1><br/>

      {logado && (
        <div>
          <strong>Seja bem vindo!</strong><br/>
          <span>{user.uid} - {user.email}</span>
          <br/><br/>
        </div>
      )}

      <div className="container">

        < label>E-mail: </label>
        <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} />

        < label>Senha: </label>
        <input type="password" value={senha} onChange={(e)=> setSenha(e.target.value)} />

        <button onClick={entra}>Entra</button>
        <button onClick={novoUsuario}>Cadastra novo usuario</button>
        <button onClick={sairConta}>Sair</button><br/>
      </div>

      <hr/><br/>

      <div className="container">

        <h2>Banco de Dados :</h2>
      
        <label>ID: </label>
        <label>{idPost}</label>      
        <label>Titulo: </label>
        <textarea type="text" value={titulo} onChange={(e)=> setTitulo(e.target.value)} />
        <label>Autor: </label>
        <input type="text" value={autor} onChange={(e)=> setAutor(e.target.value)} />
        <button onClick={salvar}>Cadastra</button>
        <button onClick={buscar}>Buscar</button>
        <button onClick={editar}>Editar</button>
        <button onClick={excluir}>Excluir</button>
        <button onClick={()=>{
          setIdPost('0');
          setTitulo('');
          setAutor('');
        }}>Limpar</button>
      
        <div className="div-lista">
          <ul>
            {posts.map((post)=>{
              return(
                <li key={post.id} onClick={()=>{setIdPost(post.id);
                                                setTitulo(post.titulo);
                                                setAutor(post.autor);
                                                }}>
                  <span>ID - {post.id}</span><br/>
                  <span>Titulo: {post.titulo}</span><br/>
                  <span>Autor: {post.autor}</span><br/><br/>
                </li>
              )
            })}
          </ul>
        </div>

      </div>

    </div>
  );
}

export default App;
