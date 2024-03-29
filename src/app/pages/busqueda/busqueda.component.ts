import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] | any[] = [];
  public medicos: Usuario[]  | any[] = [];
  public hospitales: Usuario[] | any[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private BusquedasService: BusquedasService,
               ) { }

  ngOnInit(): void {
    this.activatedRoute.params
         .subscribe( ({termino}) => this.busquedaGlobal(termino) );
  }

  busquedaGlobal(termino: string) {
    this.BusquedasService.busquedaGlobal(termino)
        .subscribe((resp: any) => {
          console.log(resp);
          this.usuarios = resp.usuarios;
          this.medicos= resp.medicos;
          this.hospitales = resp.hospitales;
        })
  }

  abrirMedico(medico: Medico) {

  }
}
