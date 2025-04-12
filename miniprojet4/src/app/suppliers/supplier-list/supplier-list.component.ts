import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../Model/Supplier';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  searchTerm: string = '';
  totalSuppliers: number = 0;
  averageProductsPerSupplier: number = 0;
  topSupplier: Supplier | null = null;
  productCountPerSupplier: Map<string, number> = new Map();
  
  statsChart: GoogleChartInterface = {
    chartType: 'ColumnChart' as const,
    dataTable: [
      ['Supplier', 'Products'],
      ['Sample Supplier', 5]
    ],
    options: {
      title: 'Products per Supplier',
      height: 400,
      width: '100%',
      legend: { position: 'none' },
      hAxis: { title: 'Supplier' },
      vAxis: { title: 'Number of Products' }
    }
  };

  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadStatistics();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(
      (data) => {
        this.suppliers = data;
      },
      (error) => {
        console.error('Error loading suppliers:', error);
      }
    );
  }

  loadStatistics(): void {
    // Load total suppliers
    this.supplierService.getTotalSuppliers().subscribe(
      (total) => {
        this.totalSuppliers = total;
      }
    );

    // Load average products per supplier
    this.supplierService.getAverageProductsPerSupplier().subscribe(
      (average) => {
        this.averageProductsPerSupplier = average;
      }
    );

    // Load top supplier
    this.supplierService.getTopSupplierByProductCount().subscribe(
      (supplier) => {
        this.topSupplier = supplier;
      }
    );

    // Load product count per supplier
    this.supplierService.getProductCountPerSupplier().subscribe(
      (data) => {
        this.productCountPerSupplier = new Map(Object.entries(data));
        this.updateChart();
      }
    );
  }

  updateChart(): void {
    const chartData: any[] = [['Supplier', 'Products']];
    this.productCountPerSupplier.forEach((count, supplier) => {
      chartData.push([supplier, count]);
    });
    this.statsChart = {
      ...this.statsChart,
      dataTable: chartData
    };
  }

  searchSuppliers(): void {
    if (this.searchTerm.trim() === '') {
      this.loadSuppliers();
    } else {
      this.suppliers = this.suppliers.filter(supplier =>
        supplier.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        supplier.telephone.includes(this.searchTerm)
      );
    }
  }

  addSupplier(): void {
    this.router.navigate(['/suppliers/add']);
  }

  editSupplier(id: number): void {
    this.router.navigate(['/suppliers/edit', id]);
  }

  deleteSupplier(id: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id).subscribe(
        () => {
          this.suppliers = this.suppliers.filter(s => s.id !== id);
          this.loadStatistics();
        },
        (error) => {
          console.error('Error deleting supplier:', error);
        }
      );
    }
  }

  viewSupplierProducts(id: number): void {
    this.router.navigate(['/suppliers', id, 'products']);
  }

  exportStats(): void {
    this.supplierService.exportAllStatsToCsv().subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'supplier_stats.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error exporting stats:', error);
      }
    );
  }

  data: any = null;

  geolocateSupplier(id: number): void {
    this.supplierService.geolocateSupplier(id).subscribe(response => {
        this.data = response;
    },
      (error) => {
        console.error('Error geolocating supplier:', error);
      }
    );
  }

  closePopup() {
    this.data = null;
  }
} 