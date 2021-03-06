addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
    let payload = JSON.parse((await request.formData()).get('payload'))
    if (payload.event === 'library.new') {
        let plexPhoto = `https://${plexurl}/photo/:/transcode?width=720&height=1080&url=${payload.Metadata.thumb}?X-Plex-Token=${plextoken}&X-Plex-Token=${plextoken}`

        let text = `🔔 ${payload.Metadata.librarySectionTitle}\n`

        const resp = await fetch(plexPhoto, {method: 'GET'})
        const formData = new FormData();
        let PhotoBlob

        if (resp.status !== 200) {
            console.log('shit')
        } else {
            PhotoBlob = await resp.blob()
        }

        let data = {
            content: text,
            attachments: [{id: 0, description: "", filename: "file.png"}],
            embeds: [{
                title: payload.Metadata.title,
                type: "rich",
                description: payload.Metadata.summary
            }]
        }
        formData.append('payload_json', JSON.stringify(data))
        formData.append('files[0]', PhotoBlob)

        await fetch(discord, {
            method: 'POST',
            body: formData
        })
    }


    return new Response('Hello worker!', {
        headers: {'content-type': 'text/plain'},
    })
}
