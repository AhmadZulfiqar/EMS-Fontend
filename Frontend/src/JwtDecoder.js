import { jwtDecode } from 'jwt-decode';

const checkToken = (token) => {
    if (!token) {
        return false
    } else {
        try {
            const decodedToken = jwtDecode(token)
            const expirationTime = decodedToken.exp
            const currentTime = Date.now() / 1000
            return currentTime < expirationTime
        } catch (error) {
            return false
        }
    }

}
export default checkToken