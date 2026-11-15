export function useAuth() {
  try {
    const user = sessionStorage.getItem('loggedInUser');
    const token = sessionStorage.getItem('eduCore_token');
    return {session: user && token ? {user: JSON.parse(user)} : null};
  } catch (_) {return {session:null};}
}
