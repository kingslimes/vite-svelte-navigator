const isSplat = ( segment: string ) => segment[0] === "*";
const isRootSegment = ( segment: string ) => segment === "";
const isDynamic = ( segment: string ) => /^:(.+)/.test( segment );
const stripSlashes = ( str: string ) => str.replace( /(^\/+|\/+$)/g, "" );

function segmentize( uri: string, filterFalsy = false ) {
	const segments = stripSlashes(uri).split("/");
	return filterFalsy ? segments.filter(Boolean) : segments;
}

const ROOT_POINTS = 1;
const STATIC_POINTS = 3;
const SPLAT_PENALTY = 1;
const DYNAMIC_POINTS = 2;
const SEGMENT_POINTS = 4;

export function rankRoute( route: string ) {
    if ( route === '' || route === '*' ) return 0;
    return segmentize( route ).reduce(( acc, segment ) => {
        let score = acc + SEGMENT_POINTS;
        if ( isRootSegment( segment ) ) score += ROOT_POINTS;
        else if ( isDynamic( segment ) ) score += DYNAMIC_POINTS;
        else if ( isSplat( segment ) ) score -= SEGMENT_POINTS + SPLAT_PENALTY;
        else score += STATIC_POINTS;
        return score;
    }, 0 );
}

export function matchRoute( pattern: string, pathname: string ) {
    if ( pattern === '' || pattern === '*' ) return {};
    const patternSegments = segmentize( pattern );
    const pathSegments = segmentize( pathname );
    const params: Record< string, string > = {};
    let i = 0;
    for ( ; i < patternSegments.length; i++ ) {
        const pSeg = patternSegments[i];
        const uSeg = pathSegments[i];
        if ( isSplat( pSeg ) ) {
            params['*'] = pathSegments.slice(i).join('/');
            return params;
        }
        if ( i >= pathSegments.length ) return null;
        if ( isDynamic( pSeg ) ) {
            const name = pSeg.slice(1);
            params[name] = decodeURIComponent(uSeg);
        } else if ( pSeg !== uSeg ) {
            return null;
        }
    }
    if ( i < pathSegments.length && patternSegments[patternSegments.length - 1] !== '*' ) {
        return null;
    }
    return params;
}
