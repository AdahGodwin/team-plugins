import client from '../client'
import { ENDPOINTS } from '../endpoints'

export const notifService = {
    getAll: () =>
        client.get(ENDPOINTS.NOTIFICATIONS.LIST),

    markRead: (id: number) =>
        client.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),

    markAllRead: () =>
        client.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),

    dismiss: (id: number) =>
        client.delete(ENDPOINTS.NOTIFICATIONS.DISMISS(id)),
}