const socket = new WebSocket(`ws://${location.host}`)

socket.addEventListener('message',({data})=>{
    const {type}=JSON.parse(data);
    switch(type){
        case 'update':
            location.reload();
            break;
    }
})