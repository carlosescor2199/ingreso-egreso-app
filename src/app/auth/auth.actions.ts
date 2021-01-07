import { createAction, props } from '@ngrx/store';
import { Usuario } from '../models/user.model';

export const setUser = createAction(
    '[Auth] Set User',
     props<{ user: Usuario}>()
);

export const unSetUser = createAction('[Auth] Unset User');