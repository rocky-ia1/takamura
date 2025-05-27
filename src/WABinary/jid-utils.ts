export const S_WHATSAPP_NET = '@s.whatsapp.net'
export const OFFICIAL_BIZ_JID = '16505361212@c.us'
export const SERVER_JID = 'server@c.us'
export const PSA_WID = '0@c.us'
export const STORIES_JID = 'status@broadcast'
export const META_AI_JID = '13135550002@c.us'

export type JidServer = 'c.us' | 'g.us' | 'broadcast' | 's.whatsapp.net' | 'call' | 'lid' | 'newsletter' | 'bot'

export type JidWithDevice = {
    user: string
    device?: number
}

export type FullJid = JidWithDevice & {
    server: JidServer | string
    domainType?: number
}

export const jidEncode = (
    user: string | number | null,
    server: JidServer,
    device?: number,
    agent?: number
): string => {
    const userPart = user || ''
    const agentPart = agent ? `_${agent}` : ''
    const devicePart = device !== undefined ? `:${device}` : ''
    return `${userPart}${agentPart}${devicePart}@${server}`
}

export const jidDecode = (jid: string | undefined): FullJid | undefined => {
    if (!jid || !jid.includes('@')) return undefined

    const [userCombined, server] = jid.split('@')
    const [userAgent, device] = userCombined.split(':')
    const user = userAgent.split('_')[0]

    return {
        user,
        server,
        domainType: server === 'lid' ? 1 : 0,
        device: device ? +device : undefined
    }
}

export const areJidsSameUser = (jid1: string | undefined, jid2: string | undefined) =>
    jidDecode(jid1)?.user === jidDecode(jid2)?.user

export const isJidMetaIa = (jid: string | undefined) =>
    jid?.endsWith('@bot')

export const isJidUser = (jid: string | undefined) =>
    jid?.endsWith('@s.whatsapp.net')

export const isLidUser = (jid: string | undefined) =>
    jid?.endsWith('@lid')

export const isJidBroadcast = (jid: string | undefined) =>
    jid?.endsWith('@broadcast')

export const isJidNewsletter = (jid: string | undefined) =>
    jid?.endsWith('@newsletter')

export const isJidGroup = (jid: string | undefined) =>
    jid?.endsWith('@g.us') || jid?.endsWith('@lid')

export const isJidStatusBroadcast = (jid: string) =>
    jid === 'status@broadcast'

const botRegexp = /^1313555\d{4}$|^131655500\d{2}$/

export const isJidBot = (jid: string | undefined) =>
    jid && botRegexp.test(jid.split('@')[0]) && jid.endsWith('@c.us')

export const jidNormalizedUser = (jid: string | undefined) => {
    const result = jidDecode(jid)
    if (!result) return ''
    const { user, server } = result
    return jidEncode(user, server === 'c.us' ? 's.whatsapp.net' : server as JidServer)
}
