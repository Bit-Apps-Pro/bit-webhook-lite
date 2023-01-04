
export default async function bitsFetch(data, action, method='POST',contentType = null, queryParam = null, param = null) {
  const uri = route(action, param)
  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }
  if(method === 'GET'){
    return fetch(uri, {
      method: method,
      headers: {
        'X-CSRF-TOKEN': contentType === null ? document.querySelector('meta[name="csrf-token"]').getAttribute('content') : contentType,
      },
    })
      .then(res => res.json())
  }else{
    return fetch(uri, {
      method: method,
      headers: {
        'X-CSRF-TOKEN': contentType === null ? document.querySelector('meta[name="csrf-token"]').getAttribute('content') : contentType,
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
      .then(res => res.json())
  }
  
}