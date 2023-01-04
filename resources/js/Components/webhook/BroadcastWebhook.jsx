import { useAtom } from 'jotai';
import Echo from 'laravel-echo';
import socketio from "socket.io-client";
import { $logs } from '../GlobalStates/GlobalStates';
export default function BroadcastWebhook(){
const [logs, setLogs] = useAtom($logs)
const { VITE_WS_HOST } = import.meta.env
// useEffect(() => {
const echo =new Echo({
    host: VITE_WS_HOST + ':6001',
    // path: window.location.pathname + 'socket.io',
    broadcaster: "socket.io",
    client: socketio,
    // encrypted: false,
    transports: ["websocket"],
});

echo.channel('webhook-log-event')
.listen('.webhookLogEvent', (e) => {
  if(logs === false){
      const webhookLg={id:e.id, webhook_details:e.webhook_details, seen:1}
      logs.push(webhookLg)
      setLogs(logs)
  }else{
    const existId = logs.find(log=>log.id === e.id)
    if(!existId){
      const tmp = [...logs]
      const webhookLg={id:e.id, webhook_details:e.webhook_details, seen:0}
      tmp.unshift(webhookLg)
      setLogs(tmp)
    }
  }

})

}

