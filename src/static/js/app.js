const { useState, useEffect, useCallback } = React;














function App() {
    const [items, setItems] = useState(null);
 
    useEffect(() => {
        fetch('/items')
            .then(res => res.json())
            .then(data => setItems(data));
    }, []);
 
    const onItemUpdate = useCallback((updatedItem) => {
setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    }, [items]);
 
    const onItemRemoval = useCallback((id) => {
setItems(items.filter(item => item.id !== id));
    }, [items]);
 
    return (
        <Container>
            <Row>
                <Col>
                    <TodoListCard
                        items={items}
                        onNewItem={(item) => setItems([...items, item])}
                        onItemUpdate={onItemUpdate}
                        onItemRemoval={onItemRemoval}
                    />
                </Col>
            </Row>
        </Container>
    );
}
 
function TodoListCard({ items, onNewItem, onItemUpdate, onItemRemoval }) {
    if (items === null) return 'Loading...';
 
    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">You have no todo items yet! Add one above!</p>
            )}
{items.map(item => (
                <TodoItemDisplay
key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}
 
function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);
 
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newItem })
        })
            .then(res => res.json())
            .then(item => {
                onNewItem(item);
                setNewItem('');
                setSubmitting(false);
            });
    }, [newItem, onNewItem]);
 
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Control
                    type="text"
                    value={newItem}
onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new item"
                    disabled={submitting}
                />
            </Form.Group>
            <Button type="submit" disabled={submitting || !newItem.trim()}>
                {submitting ? 'Adding...' : 'Add Item'}
            </Button>
        </Form>
    );
}
 
function TodoItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const toggleComplete = () => {
fetch(`/items/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, completed: !item.completed })
        })
            .then(res => res.json())
            .then(updatedItem => onItemUpdate(updatedItem));
    };
 
    const removeItem = () => {
fetch(`/items/${item.id}`, { method: 'DELETE' })
.then(() => onItemRemoval(item.id));
    };
 
    return (
        <div className="todo-item">
            <input
                type="checkbox"
                checked={item.completed}
                onChange={toggleComplete}
            />
{item.name}</span>
            <Button variant="danger" onClick={removeItem}>
                Delete
            </Button>
        </div>
    );
}
