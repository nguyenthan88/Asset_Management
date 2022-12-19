using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    public partial class Update_Relationships_Between_User_Assignment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignment_AspNetUsers_AssignedBy",
                table: "Assignment");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Assignment");

            migrationBuilder.AlterColumn<string>(
                name: "AssignedTo",
                table: "Assignment",
                type: "nvarchar(225)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "AssignedBy",
                table: "Assignment",
                type: "nvarchar(225)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(225)");

            migrationBuilder.CreateIndex(
                name: "IX_Assignment_AssignedTo",
                table: "Assignment",
                column: "AssignedTo");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignment_AspNetUsers_AssignedBy",
                table: "Assignment",
                column: "AssignedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Assignment_AspNetUsers_AssignedTo",
                table: "Assignment",
                column: "AssignedTo",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignment_AspNetUsers_AssignedBy",
                table: "Assignment");

            migrationBuilder.DropForeignKey(
                name: "FK_Assignment_AspNetUsers_AssignedTo",
                table: "Assignment");

            migrationBuilder.DropIndex(
                name: "IX_Assignment_AssignedTo",
                table: "Assignment");

            migrationBuilder.AlterColumn<string>(
                name: "AssignedTo",
                table: "Assignment",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(225)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AssignedBy",
                table: "Assignment",
                type: "nvarchar(225)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(225)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Assignment",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignment_AspNetUsers_AssignedBy",
                table: "Assignment",
                column: "AssignedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
