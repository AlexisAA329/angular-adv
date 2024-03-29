import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs!: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarHospitales();

    this.imgSubs =  this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe( img => this.cargarHospitales());
  }


  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.cargarHospitales();
    }

    this.busquedasService.buscar( 'hospitales', termino )
        .subscribe( (resp: any) => {

          this.hospitales = resp;

        });
  }

  
  cargarHospitales() {
    this.cargando = true

    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: any)  => {
        this.cargando = false;
        this.hospitales = hospitales;
      })
  }

  guardarCambios(hospital: Hospital) {

    this.hospitalService.actualizarHospitales(hospital._id, hospital.nombre)
    .subscribe( resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success')
    });
  }

 eliminarCambios(hospital: Hospital) {

    this.hospitalService.borrarHospitales(hospital._id)
    .subscribe( resp => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success')
    });
  }

  
async abrirSwitAlert() {

  const  { value = '' }  = await Swal.fire<string>({
    title: 'Crear hospital',
    text: 'Ingrese el nombre del nuevo hospital',
    input: 'text',
    showCancelButton: true,
    inputPlaceholder: 'Nombre del hyospital'
  })
  
  if ( value.trim().length > 0) {
    this.hospitalService.crearHospitales( value )
      .subscribe((resp: any) => { 
        this.hospitales.push( resp.hospital )
      })
  }
  
}

abrirModal(hospital: Hospital) {
  this.modalImagenService.abrirModal('hospitales', hospital._id , hospital.img );

}

}
