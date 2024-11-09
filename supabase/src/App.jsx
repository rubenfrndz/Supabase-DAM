import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      alert("Por favor completa ambos campos antes de enviar.");
      return;
    }
    const data = { title, body };
    console.log("Datos a enviar:", data);
    try {
      const { error } = await supabase.from('Posts').insert([data]);
      if (error) {
        console.error('Error al enviar los datos a Supabase:', error);
      } else {
        alert('Datos enviados exitosamente a Supabase');
        readData();
        setTitle('');
        setBody('');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };
  

  const readData = async () => {
    try {
      const { data, error } = await supabase.from('Posts').select('*');
      if (error) {
        console.error('Error al leer los datos', error);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };


  const handleEdit = (post) => {
    setSelectedPost(post.id);
    setTitle(post.title);
    setBody(post.body);
  };

  const updateData = async () => {
    const data = { title, body };
    try {
      const { error } = await supabase.from('Posts').update(data).eq('id', selectedPost);
      if (error) {
        console.error('Error al actualizar los datos', error);
      } else {
        alert('Datos actualizados exitosamente');
        readData();
        setSelectedPost(null);
        setTitle('');
        setBody('');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };


  const deleteData = async (postId) => {
    try {
      const { error } = await supabase.from('Posts').delete().eq('id', postId);
      if (error) {
        console.error('Error al eliminar los datos', error);
      } else {
        alert('Datos eliminados exitosamente');
        readData();
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };


  useEffect(() => {
    readData();
  }, []);


  
  return (
    <>
      <form className="container-create" onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
        <button type="submit">ENVIAR</button>
      </form>

      <div className="container-read">
        <h2>Posts</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <p>Title: {post.title}</p>
              <p>Body: {post.body}</p>
              <button onClick={() => handleEdit(post)}>Editar</button>
              <button onClick={() => deleteData(post.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedPost && (
        <div className="container-update">
          <h2>Actualizar Post</h2>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
          <button onClick={updateData}>Guardar Cambios</button>
          <button onClick={() => setSelectedPost(null)}>Cancelar</button>
        </div>
      )}
    </>
  );
}

export default App;