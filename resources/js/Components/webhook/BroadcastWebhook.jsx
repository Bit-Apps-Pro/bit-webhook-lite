import { useAtom } from 'jotai';
import Echo from 'laravel-echo';
import socketio from "socket.io-client";
import { $logs, $randomUrl } from '../GlobalStates/GlobalStates';
export default function BroadcastWebhook(){
const [logs, setLogs] = useAtom($logs)
const [randomURL] = useAtom($randomUrl)
const { VITE_WS_HOST, VITE_WS_PATH } = import.meta.env

const echo =new Echo({
    host: VITE_WS_HOST,
    path: `${VITE_WS_PATH}/socket.io`,
    // path: window.location.pathname + 'socket.io',
    broadcaster: "socket.io",
    client: socketio,
    // encrypted: false,
    transports: ["websocket"],
});


echo.channel(`${randomURL}-webhook-log-event`)
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

