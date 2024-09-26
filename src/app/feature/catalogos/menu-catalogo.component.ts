import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

export interface catalogueData {
  name: string;
  url: string;
}

@Component({
  selector: 'app-menu-catalogo',
  templateUrl: './menu-catalogo.component.html',
  styleUrls: ['./menu-catalogo.component.css'],
})
export class MenuCatalogoComponent implements OnInit, AfterViewInit {
  loginDisplay = false;

  catalogue?: catalogueData[] = [];
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<catalogueData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private auth: AuthService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.cargarMenusCatalogos();
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  cargarMenusCatalogos() {
    const menus = this.auth.getMenus();
    const subMenus = menus.find((item) => item.url === '/catalogo');
    this.catalogue = subMenus?.subMenu.map((sub) => {
      let cat: catalogueData = {
        name: sub.name,
        url: sub.url,
      };
      return cat;
    });

    this.catalogue?.sort((a, b) => a.name.localeCompare(b.name));
    this.dataSource = new MatTableDataSource(this.catalogue);
  }
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
    //this.router.navigate([url]);
  }
}
