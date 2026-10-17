import { defineMiddleware } from "astro:middleware";

const protectedRoutes = [
	{ path: "/admin", roles: ["admin"] },
	{ path: "/dashboard", roles: ["admin", "editor"] },
];

export const onRequest = defineMiddleware( async ( context, next ) => {
   console.log( "mw", context.url.pathname, context.cookies.get( "role" )?.value );

	const role = context.cookies.get( "role" )?.value;
	if( role ) context.locals.role = role;

	const author = context.cookies.get( "author" )?.value;
	if( author ) context.locals.author = author;

	const rule = protectedRoutes.find( r => context.url.pathname.startsWith( r.path ) );

	if( rule ){
		if( !role ) return context.redirect( "/login" );
		if( !rule.roles.includes( role ) ) return new Response( "Forbidden", { status: 403 } );
	}

	return next();
});