const Flash = ({ message, type }) => {
    const allowedTypes = ['success', 'error']
    if (!allowedTypes.includes(type)) {
        return null
    }
    if (message === null || message === '') {
        return null
    }
    const style = {
        color: type === 'success' ? 'green' : 'red',
        background: 'lightgrey',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        borderColor: type === 'success' ? 'green' : 'red',
    }

    return (
        <div style={style}>
            {message}
        </div>
    )
}

export default Flash