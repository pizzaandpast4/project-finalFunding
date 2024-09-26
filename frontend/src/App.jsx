import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [stories, setStories] = useState([]);
    const [newStory, setNewStory] = useState({ title: '', image_url: '', target_amount: '' });

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        const response = await axios.get('http://localhost:5000/api/stories');
        setStories(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/stories', newStory);
        fetchStories();
        setNewStory({ title: '', image_url: '', target_amount: '' });
    };

    return (
        <div>
            <h1>Crowdfunding Platform</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} required />
                <input type="text" placeholder="Image URL" value={newStory.image_url} onChange={(e) => setNewStory({ ...newStory, image_url: e.target.value })} required />
                <input type="number" placeholder="Target Amount" value={newStory.target_amount} onChange={(e) => setNewStory({ ...newStory, target_amount: e.target.value })} required />
                <button type="submit">Create Story</button>
            </form>
            <h2>Stories</h2>
            <ul>
                {stories.map(story => (
                    <li key={story.id}>
                        <h3>{story.title}</h3>
                        <img src={story.image_url} alt={story.title} />
                        <p>Target: {story.target_amount} | Collected: {story.collected_amount}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
