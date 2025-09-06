import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';

@Component({
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './default.html',
})
export default class Default {}
