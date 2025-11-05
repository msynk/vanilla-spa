export function renderTemplate(
    html: string,
    data: Record<string, string | number> = {}
): string {
    return html.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        const value = data[key.trim()]
        return value !== undefined ? String(value) : ''
    })
}
