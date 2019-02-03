import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DataService } from '../../services/data/data.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

interface User {
  id: number;
  name: string;
}

interface Comment {
  text: string;
  standalone: boolean;
}

@Component({
  selector: 'app-create-deposit',
  templateUrl: './create-deposit.component.html',
  styleUrls: ['./create-deposit.component.scss']
})

export class CreateDepositComponent implements OnInit {

  public loading: boolean;
  userControl = new FormControl();
  commentControl = new FormControl();
  form: FormGroup;
  public minCommentLength = 4;
  public maxCommentLength = 64;
  private formSubmitAttempt: boolean;
  public users: User[];
  public deposit: any = {};
  public filteredUsers: Observable<User[]>;
  public comments: Comment[] = [
    {
      text: 'Cash deposit',
      standalone: true
    },
    {
      text: 'Deposit to bank account',
      standalone: true
    },
    {
      text: 'Other',
      standalone: false
    },
  ];

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<CreateDepositComponent>) {}

  /** Set loading to true and create the form and load all users. */
  ngOnInit() {
    this.loading = true;
    this.createForm();
    this.loadData();
  }

  /** Load all users from the backend. Convert them to a simplified user
      object containing only the id and the name.*/
  loadData() {
    const users = this.dataService.getUsers();
    forkJoin([users]).subscribe(result => {
      this.users = this.convertUsers(result[0]['users']);
      this.processingData();
    });
  }

  /** Creates the deposit form. */
  createForm() {
    this.form = this.fb.group({
      amount: [null, Validators.required],
      user_id: [null, Validators.required],
      comment: [null, Validators.compose([
        Validators.required,
        Validators.minLength(this.minCommentLength),
        Validators.maxLength(this.maxCommentLength)])
      ]
    });
  }

  /** Checks all form fields for their validity. */
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  /** Convert the users to the simplified user object and set loading
      to false. */
  processingData() {
    this.filteredUsers = this.userControl.valueChanges
    .pipe(
      startWith<string | User>(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filterUsers(name) : this.users.slice())
    );
    this.loading = false;
  }

  /** Helper function which converts the users. */
  convertUsers(users): User[] {
    return users.map(user => ({
      id: user.id,
      name: user.lastname + ', ' + user.firstname
    }));
  }

  /** This function gets called each time a new user gets selected in
      the mat-autocomplete dropdown field. */
  userChanged(event) {
    const user = event.option.value;
    if (user !== undefined && user !== null) {
      this.form.controls['user_id'].setValue(user.id);
    } else {
      this.form.controls['user_id'].setValue(null);
    }
  }

  /** This function gets called each time a new comment gets selected in
      the comments dropdown field. */
  commentChanged(event) {
    const comment = event.value;
    if (comment !== undefined && comment !== null && comment.standalone) {
      this.form.controls['comment'].setValue(comment.text);
    } else {
      this.form.controls['comment'].setValue(null);
    }
  }

  /** The comment field for own entries should only be displayed if the
      selected comment can not stand alone. */
  showCommentField() {
    const value = this.commentControl.value;
    return value ? !value.standalone : false;
  }

  /** Indicates whether the length of the comment is within the
      permitted range. */
  commentLengthHint() {
    const value = this.form.get('comment').value;
    if (value === null) {
      return '0 / ' + this.maxCommentLength.toString();
    }
    return value.length.toString() + ' / ' + this.maxCommentLength.toString();
  }

  /** Deletes the user field from the form. */
  resetUser() {
    this.form.controls['user_id'].setValue(null);
    this.userControl.setValue('');
  }

  /** Returns the username for the dropdown menu. */
  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  /** This function filters users according to the search term entered. */
  private _filterUsers(name: string): User[] {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) > -1
    );
  }

  /** Submits the deposit form. */
  submitForm() {
    if (this.form.valid) {
      this.dataService.createDeposit(this.form.value).subscribe(() => {
        this.closeDialog();
      });
    } else {
      this.snackbar.openSnackBar('The form is invalid.');
    }
  }

  /** Close the dialog. */
  closeDialog() {
    this.dialogRef.close();
  }
}
