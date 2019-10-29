import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forkJoin, Observable} from 'rxjs';
import {DataService} from '../../services/data/data.service';
import {SnackbarService} from '../../services/snackbar/snackbar.service';
import {MatDialogRef} from '@angular/material';
import {map, startWith} from 'rxjs/operators';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  affected: boolean;
  rank_id: number;
}

interface Rank {
  id: number;
  name: string;
  active: boolean;
  checked: boolean;
}

interface Comment {
  text: string;
  standalone: boolean;
}

@Component({
  selector: 'app-create-batch-deposit',
  templateUrl: './create-batch-deposit.component.html',
  styleUrls: ['./create-batch-deposit.component.scss']
})
export class CreateBatchDepositComponent implements OnInit {

  public loading: boolean;
  public canSubmit: boolean;
  commentControl = new FormControl();
  form: FormGroup;
  public minCommentLength = 4;
  public maxCommentLength = 64;
  private formSubmitAttempt: boolean;
  public users: User[];
  public ranks: Rank[];
  public deposit: any = {};
  public showAffectedUsers: boolean;
  public comments: Comment[] = [
    {
      text: 'Cash deposit',
      standalone: true
    },
    {
      text: 'Membership fee',
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
    public dialogRef: MatDialogRef<CreateBatchDepositComponent>) {}

  /** Set loading to true and create the form and load all users. */
  ngOnInit() {
    this.loading = true;
    this.showAffectedUsers = false;
    this.canSubmit = false;
    this.createForm();
    this.loadData();
  }

  /** Load all users from the backend. Convert them to a simplified user
   object containing only the id and the name.*/
  loadData() {
    const users = this.dataService.getUsers();
    const ranks = this.dataService.getRanks();
    forkJoin([users, ranks]).subscribe(result => {
      this.users = <User[]>result[0];
      this.ranks = <Rank[]>result[1];
      this.processingData();
    });
  }

  public getUsername(user: User): string {
    if (user.firstname !== 'undefined') {
      return [user.lastname, user.firstname].join(', ');
    } else {
      return user.lastname;
    }
  }

  public getRankNameOfUser(user: User): string {
    return this.ranks.find(r => r.id === user.rank_id).name;
  }

  /** Creates the deposit form. */
  createForm() {
    this.form = this.fb.group({
      amount: [null, Validators.required],
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
    for (const rank of this.ranks) {
      rank.checked = false;
    }
    this.loading = false;
  }

  isUserAffected(user: User): boolean {
    return (this.ranks.find(r => r.id === user.rank_id)).checked;
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

  sortedUsers(): User[] {
    const that = this;
    return this.users.sort(function (u1, u2) {
      return that.getUsername(u1).localeCompare(that.getUsername(u2));
    });
  }

  /** Submits the deposit form. */
  submitForm() {
    if (!this.form.valid) {
      this.snackbar.openSnackBar('The form is invalid.');
      this.canSubmit = false;
      return;
    }
    if (!this.canSubmit) {
      this.snackbar.openSnackBar('Check the affected users and click submit' +
        'again to confirm the batch deposit.');
      this.showAffectedUsers = true;
      this.canSubmit = true;
    } else {
      const data = this.form.value;
      data['user_ids'] = [];
      for (const user of this.users) {
        if (this.isUserAffected(user)) {
          data['user_ids'].push(user.id);
        }
      }
      this.dataService.createBatchDeposit(data).subscribe(() => {
        this.closeDialog();
      });
    }
  }

  /** Close the dialog. */
  closeDialog() {
    this.dialogRef.close();
  }

}
