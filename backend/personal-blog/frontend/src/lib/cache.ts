let cache: any[] | null = null;

export const getBlogs = async () => {
	if( !cache ){
		cache = await fetch( "http://localhost:3000/api/blog" )
			.then( r => r.json() )
			.then( r => r.data );
	}
	return cache;
}

export const getBlogById = async (id: string)=>{

	let target = cache?.find( (blog:any) => blog.id === id )
	if( target ) return target;

	const res = await fetch( `http://localhost:3000/api/blog/${id}` );
	const {data} = await res.json();

	if(cache === null){
		cache = [data]
	}else{
		cache.push(data);
	}

	return data;
}

export const invalidateBlogs = () => {
	cache = null;
}

export interface User{
	name:string,
	password:string,
	role?:string
}

let  user: User | null = null;

export const getUser = async ({name, password}: User, reset: boolean = false) => {

	if(!user || ( user.name !== name || user.password !== password )) {

		const res = await fetch("http://localhost:3000/api/user/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				password
			})
		})
		if(!res.ok) return null;

		const { data } = await res.json();
		user = data;
	}

	return user;
}

export const createUser = async({ name, password, role}: User) => {
	
	const res = await fetch("http://localhost:3000/api/user", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name,
			password,
			role
		})
	})
	if(!res.ok) return null;
	const { data } = await res.json();

	return data;
}

export const invalidateUser = () => {
	user = null;
}