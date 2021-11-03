export default function isDiscordId(potentialDiscordId: string) {
    // Regex: /([0-9]{18})/ -> Ensures that ID is all numbers and is 18 digits long
    return /([0-9]{18})/.test(potentialDiscordId)
}